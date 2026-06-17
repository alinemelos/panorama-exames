from rest_framework import serializers
from apps.authentication.models import CustomUser


class ResetRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'role']
