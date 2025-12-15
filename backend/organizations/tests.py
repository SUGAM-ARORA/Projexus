"""
Tests for organizations app.
"""
from django.test import TestCase
from .models import Organization


class OrganizationModelTest(TestCase):
    """Test Organization model."""
    
    def setUp(self):
        self.org = Organization.objects.create(
            name="Test Organization",
            contact_email="test@example.com"
        )
    
    def test_organization_creation(self):
        """Test organization creation."""
        self.assertEqual(self.org.name, "Test Organization")
        self.assertEqual(self.org.contact_email, "test@example.com")
        self.assertTrue(self.org.slug)
    
    def test_slug_auto_generation(self):
        """Test slug auto-generation."""
        self.assertEqual(self.org.slug, "test-organization")
    
    def test_project_count(self):
        """Test project count property."""
        self.assertEqual(self.org.project_count, 0)

