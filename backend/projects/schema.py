"""
GraphQL schema for projects.
"""
import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from datetime import datetime
from .models import Project
from organizations.models import Organization


class ProjectType(DjangoObjectType):
    """Project GraphQL type."""
    
    task_count = graphene.Int()
    completed_task_count = graphene.Int()
    completion_rate = graphene.Float()
    is_overdue = graphene.Boolean()
    
    class Meta:
        model = Project
        fields = '__all__'
    
    def resolve_task_count(self, info):
        return self.task_count
    
    def resolve_completed_task_count(self, info):
        return self.completed_task_count
    
    def resolve_completion_rate(self, info):
        return self.completion_rate
    
    def resolve_is_overdue(self, info):
        return self.is_overdue


class ProjectQuery(graphene.ObjectType):
    """Project queries."""
    
    projects = graphene.List(
        ProjectType,
        organization_slug=graphene.String(required=True),
        status=graphene.String()
    )
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))
    project_stats = graphene.Field(
        'projects.schema.ProjectStatsType',
        organization_slug=graphene.String(required=True)
    )
    
    def resolve_projects(self, info, organization_slug, status=None):
        """Get projects for an organization."""
        try:
            organization = Organization.objects.get(slug=organization_slug)
        except Organization.DoesNotExist:
            raise GraphQLError(f"Organization with slug '{organization_slug}' not found")
        
        queryset = Project.objects.filter(organization=organization)
        
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset
    
    def resolve_project(self, info, id):
        """Get a single project."""
        try:
            return Project.objects.get(pk=id)
        except Project.DoesNotExist:
            raise GraphQLError(f"Project with id '{id}' not found")
    
    def resolve_project_stats(self, info, organization_slug):
        """Get project statistics for an organization."""
        try:
            organization = Organization.objects.get(slug=organization_slug)
        except Organization.DoesNotExist:
            raise GraphQLError(f"Organization with slug '{organization_slug}' not found")
        
        projects = Project.objects.filter(organization=organization)
        total_projects = projects.count()
        active_projects = projects.filter(status='ACTIVE').count()
        completed_projects = projects.filter(status='COMPLETED').count()
        
        total_tasks = sum(p.task_count for p in projects)
        completed_tasks = sum(p.completed_task_count for p in projects)
        
        return ProjectStatsType(
            total_projects=total_projects,
            active_projects=active_projects,
            completed_projects=completed_projects,
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            overall_completion_rate=round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 2)
        )


class ProjectStatsType(graphene.ObjectType):
    """Project statistics type."""
    total_projects = graphene.Int()
    active_projects = graphene.Int()
    completed_projects = graphene.Int()
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    overall_completion_rate = graphene.Float()


class CreateProject(graphene.Mutation):
    """Create a new project."""
    
    class Arguments:
        organization_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()
    
    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, organization_slug, name, description=None, status='ACTIVE', due_date=None):
        try:
            organization = Organization.objects.get(slug=organization_slug)
        except Organization.DoesNotExist:
            raise GraphQLError(f"Organization with slug '{organization_slug}' not found")
        
        if status not in dict(Project.STATUS_CHOICES):
            raise GraphQLError(f"Invalid status. Must be one of: {', '.join(dict(Project.STATUS_CHOICES).keys())}")
        
        project = Project.objects.create(
            organization=organization,
            name=name,
            description=description or '',
            status=status,
            due_date=due_date
        )
        
        return CreateProject(
            project=project,
            success=True,
            message="Project created successfully"
        )


class UpdateProject(graphene.Mutation):
    """Update an existing project."""
    
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()
    
    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, name=None, description=None, status=None, due_date=None):
        try:
            project = Project.objects.get(pk=id)
        except Project.DoesNotExist:
            raise GraphQLError(f"Project with id '{id}' not found")
        
        if name:
            project.name = name
        if description is not None:
            project.description = description
        if status:
            if status not in dict(Project.STATUS_CHOICES):
                raise GraphQLError(f"Invalid status. Must be one of: {', '.join(dict(Project.STATUS_CHOICES).keys())}")
            project.status = status
        if due_date is not None:
            project.due_date = due_date
        
        project.save()
        
        return UpdateProject(
            project=project,
            success=True,
            message="Project updated successfully"
        )


class DeleteProject(graphene.Mutation):
    """Delete a project."""
    
    class Arguments:
        id = graphene.ID(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id):
        try:
            project = Project.objects.get(pk=id)
            project.delete()
            return DeleteProject(
                success=True,
                message="Project deleted successfully"
            )
        except Project.DoesNotExist:
            raise GraphQLError(f"Project with id '{id}' not found")


class ProjectMutation(graphene.ObjectType):
    """Project mutations."""
    
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()

