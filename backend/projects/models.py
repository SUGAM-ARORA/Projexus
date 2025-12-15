"""
Project models.
"""
from django.db import models
from django.core.validators import MinLengthValidator
from organizations.models import Organization


class Project(models.Model):
    """Project model."""
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('ON_HOLD', 'On Hold'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='projects',
        db_index=True
    )
    name = models.CharField(max_length=200, validators=[MinLengthValidator(3)])
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['due_date']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.organization.name})"
    
    @property
    def task_count(self):
        """Get total number of tasks."""
        return self.tasks.count()
    
    @property
    def completed_task_count(self):
        """Get number of completed tasks."""
        return self.tasks.filter(status='DONE').count()
    
    @property
    def completion_rate(self):
        """Calculate completion rate as percentage."""
        total = self.task_count
        if total == 0:
            return 0
        return round((self.completed_task_count / total) * 100, 2)
    
    @property
    def is_overdue(self):
        """Check if project is overdue."""
        if self.due_date:
            from django.utils import timezone
            return timezone.now().date() > self.due_date and self.status != 'COMPLETED'
        return False

