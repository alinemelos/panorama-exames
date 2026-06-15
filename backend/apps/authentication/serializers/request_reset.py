from rest_framework import serializers
from apps.authentication.models import CustomUser


class RequestResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            self.context['user'] = CustomUser.objects.get(email=value, is_active=True)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('No active account found with this email.')
        return value
