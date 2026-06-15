from rest_framework import serializers
from apps.authentication.models import CustomUser


class SetPasswordSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError('Passwords do not match.')
        try:
            data['user'] = CustomUser.objects.get(activation_token=data['token'], is_active=False)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('Invalid or expired token.')
        return data
