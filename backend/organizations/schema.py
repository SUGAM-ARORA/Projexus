"""
GraphQL schema for organizations.
"""
import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.utils.text import slugify
from .models import Organization


class OrganizationType(DjangoObjectType):
    """Organization GraphQL type."""
    
    project_count = graphene.Int()
    active_project_count = graphene.Int()
    
    class Meta:
        model = Organization
        fields = '__all__'
    
    def resolve_project_count(self, info):
        return self.project_count
    
    def resolve_active_project_count(self, info):
        return self.active_project_count


class OrganizationQuery(graphene.ObjectType):
    """Organization queries."""
    
    organizations = graphene.List(OrganizationType)
    organization = graphene.Field(OrganizationType, slug=graphene.String(required=True))
    
    def resolve_organizations(self, info):
        """Get all organizations."""
        return Organization.objects.all()
    
    def resolve_organization(self, info, slug):
        """Get a single organization by slug."""
        try:
            return Organization.objects.get(slug=slug)
        except Organization.DoesNotExist:
            raise GraphQLError(f"Organization with slug '{slug}' not found")


class CreateOrganization(graphene.Mutation):
    """Create a new organization."""
    
    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)
        slug = graphene.String()
    
    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, name, contact_email, slug=None):
        if slug:
            if Organization.objects.filter(slug=slug).exists():
                raise GraphQLError(f"Organization with slug '{slug}' already exists")
        else:
            # Auto-generate slug from name
            base_slug = slugify(name)
            slug = base_slug
            counter = 1
            while Organization.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
        
        organization = Organization.objects.create(
            name=name,
            slug=slug,
            contact_email=contact_email
        )
        
        return CreateOrganization(
            organization=organization,
            success=True,
            message="Organization created successfully"
        )


class UpdateOrganization(graphene.Mutation):
    """Update an existing organization."""
    
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        contact_email = graphene.String()
    
    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, name=None, contact_email=None):
        try:
            organization = Organization.objects.get(pk=id)
        except Organization.DoesNotExist:
            raise GraphQLError(f"Organization with id '{id}' not found")
        
        if name:
            organization.name = name
        if contact_email:
            organization.contact_email = contact_email
        
        organization.save()
        
        return UpdateOrganization(
            organization=organization,
            success=True,
            message="Organization updated successfully"
        )


class OrganizationMutation(graphene.ObjectType):
    """Organization mutations."""
    
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()

