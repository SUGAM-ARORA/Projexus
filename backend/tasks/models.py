"""
Task models.
"""
from django.db import models
from django.core.validators import EmailValidator, MinLengthValidator
from projects.models import Project


class Task(models.Model):
    """Task model."""
    
    STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('DONE', 'Done'),
        ('BLOCKED', 'Blocked'),
    ]
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks',
        db_index=True
    )
    title = models.CharField(max_length=200, validators=[MinLengthValidator(3)])
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TODO')
    assignee_email = models.EmailField(blank=True, validators=[EmailValidator()])
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order = models.IntegerField(default=0, help_text="Order for drag-and-drop")
    
    class Meta:
        ordering = ['order', '-created_at']
        indexes = [
            models.Index(fields=['project', 'status']),
            models.Index(fields=['assignee_email']),
            models.Index(fields=['due_date']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.project.name})"
    
    @property
    def comment_count(self):
        """Get total number of comments."""
        return self.comments.count()
    
    @property
    def is_overdue(self):
        """Check if task is overdue."""
        if self.due_date:
            from django.utils import timezone
            return timezone.now() > self.due_date and self.status != 'DONE'
        return False


class TaskComment(models.Model):
    """Task comment model."""
    
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='comments',
        db_index=True
    )
    content = models.TextField(validators=[MinLengthValidator(1)])
    author_email = models.EmailField(validators=[EmailValidator()])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['task', 'created_at']),
        ]
    
    def __str__(self):
        return f"Comment on {self.task.title} by {self.author_email}"

