"""
Views for User Authentication & Profiles
"""

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, StudioProfile, CustomerProfile
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    StudioProfileSerializer, CustomerProfileSerializer, ChangePasswordSerializer
)


class RegisterView(generics.CreateAPIView):
    """API endpoint for user registration"""
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Registration successful!'
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """API endpoint for user login"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Login successful!'
        })


class LogoutView(APIView):
    """API endpoint for user logout"""
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful!'})
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    """API endpoint for user profile"""
    
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class StudioProfileView(generics.RetrieveUpdateAPIView):
    """API endpoint for studio profile"""
    
    serializer_class = StudioProfileSerializer
    
    def get_object(self):
        return StudioProfile.objects.get(user=self.request.user)


class CustomerProfileView(generics.RetrieveUpdateAPIView):
    """API endpoint for customer profile"""
    
    serializer_class = CustomerProfileSerializer
    
    def get_object(self):
        return CustomerProfile.objects.get(user=self.request.user)


class ChangePasswordView(generics.UpdateAPIView):
    """API endpoint for changing password"""
    
    serializer_class = ChangePasswordSerializer
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        return Response({'message': 'Password changed successfully!'})


class StudioListView(generics.ListAPIView):
    """API endpoint to list all studios"""
    
    queryset = StudioProfile.objects.filter(is_verified=True)
    serializer_class = StudioProfileSerializer
    permission_classes = [permissions.AllowAny]
