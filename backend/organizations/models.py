"""
Organization models.
"""
from django.db import models
from django.core.validators import EmailValidator
from django.utils.text import slugify


class Organization(models.Model):
    """Organization model for multi-tenancy."""
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    contact_email = models.EmailField(validators=[EmailValidator()])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def project_count(self):
        """Get total number of projects."""
        return self.projects.count()
    
    @property
    def active_project_count(self):
        """Get number of active projects."""
        return self.projects.filter(status='ACTIVE').count()

