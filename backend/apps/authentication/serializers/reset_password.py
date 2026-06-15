from rest_framework import serializers
from apps.authentication.models import CustomUser


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    new_password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError('Passwords do not match.')
        try:
            data['user'] = CustomUser.objects.get(activation_token=data['token'], is_active=True)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('Invalid or expired token.')
        return data
