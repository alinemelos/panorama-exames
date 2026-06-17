from rest_framework import serializers
from apps.authentication.models import CustomUser


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'created_at', 'password_reset_requested', 'is_active']
