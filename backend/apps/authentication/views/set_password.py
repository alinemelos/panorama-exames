from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.authentication.serializers import SetPasswordSerializer


class SetPasswordView(APIView):
    serializer_class = SetPasswordSerializer

    @extend_schema(tags=['Autenticação'])
    def post(self, request):
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        user.set_password(serializer.validated_data['password'])
        user.is_active = True
        user.activation_token = None
        user.save()
        return Response({'detail': 'Password set successfully. You can now log in.'})
