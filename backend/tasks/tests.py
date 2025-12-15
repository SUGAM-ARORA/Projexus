"""
Tests for tasks app.
"""
from django.test import TestCase
from organizations.models import Organization
from projects.models import Project
from .models import Task, TaskComment


class TaskModelTest(TestCase):
    """Test Task model."""
    
    def setUp(self):
        self.org = Organization.objects.create(
            name="Test Organization",
            contact_email="test@example.com"
        )
        self.project = Project.objects.create(
            organization=self.org,
            name="Test Project",
            status="ACTIVE"
        )
        self.task = Task.objects.create(
            project=self.project,
            title="Test Task",
            description="Test Description",
            status="TODO"
        )
    
    def test_task_creation(self):
        """Test task creation."""
        self.assertEqual(self.task.title, "Test Task")
        self.assertEqual(self.task.project, self.project)
        self.assertEqual(self.task.status, "TODO")
    
    def test_comment_count(self):
        """Test comment count property."""
        self.assertEqual(self.task.comment_count, 0)
        
        TaskComment.objects.create(
            task=self.task,
            content="Test comment",
            author_email="test@example.com"
        )
        
        self.assertEqual(self.task.comment_count, 1)

