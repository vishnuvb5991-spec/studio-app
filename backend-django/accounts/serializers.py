"""
Serializers for User Authentication & Profiles
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, StudioProfile, CustomerProfile


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 
                  'phone', 'user_type', 'profile_picture', 'is_verified', 'created_at']
        read_only_fields = ['id', 'is_verified', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'phone', 
                  'user_type', 'password', 'password2']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        
        # Create profile based on user type
        if user.user_type == 'studio_owner':
            StudioProfile.objects.create(user=user, studio_name=f"{user.first_name}'s Studio")
        else:
            CustomerProfile.objects.create(user=user)
        
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        user = authenticate(username=email, password=password)
        
        if not user:
            raise serializers.ValidationError('Invalid credentials')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled')
        
        attrs['user'] = user
        return attrs


class StudioProfileSerializer(serializers.ModelSerializer):
    """Serializer for Studio Profile"""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudioProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'rating', 'total_reviews', 'created_at']


class CustomerProfileSerializer(serializers.ModelSerializer):
    """Serializer for Customer Profile"""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CustomerProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value
