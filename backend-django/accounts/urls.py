"""
URL patterns for Accounts app
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView, ProfileView,
    StudioProfileView, CustomerProfileView, ChangePasswordView, StudioListView
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/studio/', StudioProfileView.as_view(), name='studio_profile'),
    path('profile/customer/', CustomerProfileView.as_view(), name='customer_profile'),
    path('password/change/', ChangePasswordView.as_view(), name='change_password'),
    
    # Studios List
    path('studios/', StudioListView.as_view(), name='studio_list'),
]
