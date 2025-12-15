"""
Tests for projects app.
"""
from django.test import TestCase
from organizations.models import Organization
from .models import Project


class ProjectModelTest(TestCase):
    """Test Project model."""
    
    def setUp(self):
        self.org = Organization.objects.create(
            name="Test Organization",
            contact_email="test@example.com"
        )
        self.project = Project.objects.create(
            organization=self.org,
            name="Test Project",
            description="Test Description",
            status="ACTIVE"
        )
    
    def test_project_creation(self):
        """Test project creation."""
        self.assertEqual(self.project.name, "Test Project")
        self.assertEqual(self.project.organization, self.org)
        self.assertEqual(self.project.status, "ACTIVE")
    
    def test_task_count(self):
        """Test task count property."""
        self.assertEqual(self.project.task_count, 0)
    
    def test_completion_rate(self):
        """Test completion rate calculation."""
        self.assertEqual(self.project.completion_rate, 0)

