from django.conf import settings
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from apps.authentication.serializers import LoginSerializer


class LoginView(APIView):
    serializer_class = LoginSerializer

    @extend_schema(
        tags=['Autenticação'],
        summary='Login',
        description='Autentica com email e password; em caso de sucesso, seta cookies HTTP-only com access/refresh JWT.',
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        response = Response({'role': user.role, 'name': user.name})
        cookie_kwargs = {
            'httponly': True,
            'samesite': 'Lax',
            'secure': not settings.DEBUG,
        }
        response.set_cookie('access_token', str(refresh.access_token), **cookie_kwargs)
        response.set_cookie('refresh_token', str(refresh), **cookie_kwargs)
        return response


class LogoutView(APIView):
    @extend_schema(
        request=None,
        responses=OpenApiTypes.OBJECT,
        tags=['Autenticação'],
        summary='Logout',
        description='Limpa os cookies de JWT, efetivando o logout.',
    )
    def post(self, request):
        response = Response({'detail': 'Logged out.'})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response
