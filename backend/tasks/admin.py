from django.contrib import admin
from .models import Task, TaskComment


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'status', 'assignee_email', 'due_date', 'comment_count', 'created_at']
    list_filter = ['status', 'project', 'created_at', 'due_date']
    search_fields = ['title', 'description', 'assignee_email', 'project__name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['task', 'author_email', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'author_email', 'task__title']
    readonly_fields = ['created_at', 'updated_at']

