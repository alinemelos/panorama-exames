from rest_framework import serializers
from apps.authentication.models import CustomUser


class RequestAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'name', 'role']

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value
