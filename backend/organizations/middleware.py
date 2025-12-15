"""
Middleware for organization context.
"""
from django.utils.deprecation import MiddlewareMixin
from .models import Organization


class OrganizationMiddleware(MiddlewareMixin):
    """
    Middleware to set organization context from request headers or query params.
    """
    
    def process_request(self, request):
        # Get organization from header or query parameter
        org_slug = request.META.get('HTTP_X_ORGANIZATION_SLUG') or request.GET.get('org')
        
        if org_slug:
            try:
                request.organization = Organization.objects.get(slug=org_slug)
            except Organization.DoesNotExist:
                request.organization = None
        else:
            request.organization = None
        
        return None

