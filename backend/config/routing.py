"""
WebSocket routing configuration.
"""
from django.urls import path
from tasks.consumers import TaskConsumer

websocket_urlpatterns = [
    path('ws/tasks/<str:project_id>/', TaskConsumer.as_asgi()),
]

