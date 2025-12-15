"""
GraphQL schema for tasks.
"""
import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from datetime import datetime
from django.db import models
from .models import Task, TaskComment
from projects.models import Project


class TaskCommentType(DjangoObjectType):
    """Task comment GraphQL type."""
    
    class Meta:
        model = TaskComment
        fields = '__all__'


class TaskType(DjangoObjectType):
    """Task GraphQL type."""
    
    comment_count = graphene.Int()
    is_overdue = graphene.Boolean()
    
    class Meta:
        model = Task
        fields = '__all__'
    
    def resolve_comment_count(self, info):
        return self.comment_count
    
    def resolve_is_overdue(self, info):
        return self.is_overdue


class TaskQuery(graphene.ObjectType):
    """Task queries."""
    
    tasks = graphene.List(
        TaskType,
        project_id=graphene.ID(required=True),
        status=graphene.String(),
        assignee_email=graphene.String()
    )
    task = graphene.Field(TaskType, id=graphene.ID(required=True))
    task_comments = graphene.List(
        TaskCommentType,
        task_id=graphene.ID(required=True)
    )
    
    def resolve_tasks(self, info, project_id, status=None, assignee_email=None):
        """Get tasks for a project."""
        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            raise GraphQLError(f"Project with id '{project_id}' not found")
        
        queryset = Task.objects.filter(project=project)
        
        if status:
            queryset = queryset.filter(status=status)
        if assignee_email:
            queryset = queryset.filter(assignee_email=assignee_email)
        
        return queryset
    
    def resolve_task(self, info, id):
        """Get a single task."""
        try:
            return Task.objects.get(pk=id)
        except Task.DoesNotExist:
            raise GraphQLError(f"Task with id '{id}' not found")
    
    def resolve_task_comments(self, info, task_id):
        """Get comments for a task."""
        try:
            task = Task.objects.get(pk=task_id)
        except Task.DoesNotExist:
            raise GraphQLError(f"Task with id '{task_id}' not found")
        
        return task.comments.all()


class CreateTask(graphene.Mutation):
    """Create a new task."""
    
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, project_id, title, description=None, status='TODO', assignee_email=None, due_date=None):
        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            raise GraphQLError(f"Project with id '{project_id}' not found")
        
        if status not in dict(Task.STATUS_CHOICES):
            raise GraphQLError(f"Invalid status. Must be one of: {', '.join(dict(Task.STATUS_CHOICES).keys())}")
        
        # Get max order for this project
        max_order = Task.objects.filter(project=project).aggregate(
            max_order=models.Max('order')
        )['max_order'] or 0
        
        task = Task.objects.create(
            project=project,
            title=title,
            description=description or '',
            status=status,
            assignee_email=assignee_email or '',
            due_date=due_date,
            order=max_order + 1
        )
        
        return CreateTask(
            task=task,
            success=True,
            message="Task created successfully"
        )


class UpdateTask(graphene.Mutation):
    """Update an existing task."""
    
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()
        order = graphene.Int()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, title=None, description=None, status=None, assignee_email=None, due_date=None, order=None):
        try:
            task = Task.objects.get(pk=id)
        except Task.DoesNotExist:
            raise GraphQLError(f"Task with id '{id}' not found")
        
        if title:
            task.title = title
        if description is not None:
            task.description = description
        if status:
            if status not in dict(Task.STATUS_CHOICES):
                raise GraphQLError(f"Invalid status. Must be one of: {', '.join(dict(Task.STATUS_CHOICES).keys())}")
            task.status = status
        if assignee_email is not None:
            task.assignee_email = assignee_email
        if due_date is not None:
            task.due_date = due_date
        if order is not None:
            task.order = order
        
        task.save()
        
        return UpdateTask(
            task=task,
            success=True,
            message="Task updated successfully"
        )


class DeleteTask(graphene.Mutation):
    """Delete a task."""
    
    class Arguments:
        id = graphene.ID(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id):
        try:
            task = Task.objects.get(pk=id)
            task.delete()
            return DeleteTask(
                success=True,
                message="Task deleted successfully"
            )
        except Task.DoesNotExist:
            raise GraphQLError(f"Task with id '{id}' not found")


class AddTaskComment(graphene.Mutation):
    """Add a comment to a task."""
    
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)
    
    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, task_id, content, author_email):
        try:
            task = Task.objects.get(pk=task_id)
        except Task.DoesNotExist:
            raise GraphQLError(f"Task with id '{task_id}' not found")
        
        comment = TaskComment.objects.create(
            task=task,
            content=content,
            author_email=author_email
        )
        
        return AddTaskComment(
            comment=comment,
            success=True,
            message="Comment added successfully"
        )


class UpdateTaskStatus(graphene.Mutation):
    """Update task status (optimized for drag-and-drop)."""
    
    class Arguments:
        id = graphene.ID(required=True)
        status = graphene.String(required=True)
        order = graphene.Int()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, status, order=None):
        try:
            task = Task.objects.get(pk=id)
        except Task.DoesNotExist:
            raise GraphQLError(f"Task with id '{id}' not found")
        
        if status not in dict(Task.STATUS_CHOICES):
            raise GraphQLError(f"Invalid status. Must be one of: {', '.join(dict(Task.STATUS_CHOICES).keys())}")
        
        task.status = status
        if order is not None:
            task.order = order
        task.save()
        
        return UpdateTaskStatus(
            task=task,
            success=True,
            message="Task status updated successfully"
        )


class TaskMutation(graphene.ObjectType):
    """Task mutations."""
    
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()
    add_task_comment = AddTaskComment.Field()
    update_task_status = UpdateTaskStatus.Field()

