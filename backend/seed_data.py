"""
Script to seed initial data for development and testing.
Run with: python manage.py shell < seed_data.py
Or: python manage.py runscript seed_data
"""

from organizations.models import Organization
from projects.models import Project
from tasks.models import Task, TaskComment
from django.utils import timezone
from datetime import timedelta

# Create organization
org, created = Organization.objects.get_or_create(
    slug='demo-organization',
    defaults={
        'name': 'Demo Organization',
        'contact_email': 'demo@example.com'
    }
)

if created:
    print(f"✅ Created organization: {org.name}")
else:
    print(f"ℹ️  Organization already exists: {org.name}")

# Create sample projects
project1, created = Project.objects.get_or_create(
    organization=org,
    name='Website Redesign',
    defaults={
        'description': 'Complete redesign of company website with modern UI/UX',
        'status': 'ACTIVE',
        'due_date': timezone.now().date() + timedelta(days=30)
    }
)

project2, created = Project.objects.get_or_create(
    organization=org,
    name='Mobile App Development',
    defaults={
        'description': 'Develop iOS and Android mobile application',
        'status': 'ACTIVE',
        'due_date': timezone.now().date() + timedelta(days=60)
    }
)

project3, created = Project.objects.get_or_create(
    organization=org,
    name='API Integration',
    defaults={
        'description': 'Integrate third-party APIs for payment processing',
        'status': 'ON_HOLD',
        'due_date': timezone.now().date() + timedelta(days=45)
    }
)

print(f"✅ Created/verified {Project.objects.filter(organization=org).count()} projects")

# Create sample tasks for project1
tasks_data = [
    {
        'title': 'Design mockups',
        'description': 'Create initial design mockups for homepage',
        'status': 'DONE',
        'assignee_email': 'designer@example.com',
        'due_date': timezone.now() - timedelta(days=5)
    },
    {
        'title': 'Implement header component',
        'description': 'Build responsive header with navigation',
        'status': 'IN_PROGRESS',
        'assignee_email': 'developer@example.com',
        'due_date': timezone.now() + timedelta(days=3)
    },
    {
        'title': 'Setup CI/CD pipeline',
        'description': 'Configure automated testing and deployment',
        'status': 'TODO',
        'assignee_email': 'devops@example.com',
        'due_date': timezone.now() + timedelta(days=10)
    },
    {
        'title': 'Write documentation',
        'description': 'Document API endpoints and usage',
        'status': 'TODO',
        'assignee_email': 'tech-writer@example.com',
        'due_date': timezone.now() + timedelta(days=15)
    },
]

for i, task_data in enumerate(tasks_data, 1):
    task, created = Task.objects.get_or_create(
        project=project1,
        title=task_data['title'],
        defaults={
            **task_data,
            'order': i
        }
    )
    if created:
        print(f"  ✅ Created task: {task.title}")

# Create sample tasks for project2
tasks_data2 = [
    {
        'title': 'Setup React Native project',
        'description': 'Initialize React Native project structure',
        'status': 'DONE',
        'assignee_email': 'mobile-dev@example.com',
        'order': 1
    },
    {
        'title': 'Implement authentication',
        'description': 'Add login and signup screens',
        'status': 'IN_PROGRESS',
        'assignee_email': 'mobile-dev@example.com',
        'order': 2
    },
    {
        'title': 'Design app icons',
        'description': 'Create app icons for iOS and Android',
        'status': 'TODO',
        'assignee_email': 'designer@example.com',
        'order': 3
    },
]

for task_data in tasks_data2:
    task, created = Task.objects.get_or_create(
        project=project2,
        title=task_data['title'],
        defaults=task_data
    )
    if created:
        print(f"  ✅ Created task: {task.title}")

# Add sample comments
task_with_comments = Task.objects.filter(project=project1).first()
if task_with_comments:
    comment, created = TaskComment.objects.get_or_create(
        task=task_with_comments,
        content='Great progress! Keep it up.',
        author_email='manager@example.com'
    )
    if created:
        print(f"✅ Added comment to task: {task_with_comments.title}")

print("\n🎉 Data seeding complete!")
print(f"\nSummary:")
print(f"  Organizations: {Organization.objects.count()}")
print(f"  Projects: {Project.objects.filter(organization=org).count()}")
print(f"  Tasks: {Task.objects.filter(project__organization=org).count()}")
print(f"  Comments: {TaskComment.objects.filter(task__project__organization=org).count()}")

