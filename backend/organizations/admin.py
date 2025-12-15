from django.contrib import admin
from .models import Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'contact_email', 'created_at', 'project_count']
    list_filter = ['created_at']
    search_fields = ['name', 'slug', 'contact_email']
    readonly_fields = ['created_at', 'updated_at']

