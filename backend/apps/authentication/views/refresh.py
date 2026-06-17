from django.conf import settings
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken


class RefreshView(APIView):
    @extend_schema(
        request=None,
        responses=OpenApiTypes.OBJECT,
        tags=['Autenticação'],
        summary='Refresh',
        description='Renova o access_token a partir do refresh_token armazenado em cookie HTTP-only.',
    )
    def post(self, request):
        raw_token = request.COOKIES.get('refresh_token')
        if raw_token is None:
            return Response({'detail': 'Refresh token ausente.'}, status=401)

        try:
            refresh = RefreshToken(raw_token)
        except TokenError:
            return Response({'detail': 'Refresh token inválido.'}, status=401)

        response = Response({'detail': 'Token renovado.'})
        response.set_cookie(
            'access_token',
            str(refresh.access_token),
            httponly=True,
            samesite='Lax',
            secure=not settings.DEBUG,
        )
        return response
