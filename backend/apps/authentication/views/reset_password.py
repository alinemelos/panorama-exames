from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.authentication.serializers import ResetPasswordSerializer


class ResetPasswordView(APIView):
    serializer_class = ResetPasswordSerializer

    @extend_schema(tags=['Autenticação'])
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        user.set_password(serializer.validated_data['new_password'])
        user.activation_token = None
        user.save()
        return Response({'detail': 'Password reset successfully.'})
