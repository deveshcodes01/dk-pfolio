from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfileViewSet, ServiceViewSet,
    ProjectViewSet, ArticleViewSet, contact_create
)

router = DefaultRouter()
router.register(r'profile', ProfileViewSet, basename='profile')
router.register(r'services', ServiceViewSet, basename='services')
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'articles', ArticleViewSet, basename='articles')

urlpatterns = [
    path('', include(router.urls)),
    path('contact/', contact_create, name='contact'),
]
