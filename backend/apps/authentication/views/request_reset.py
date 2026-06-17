from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.authentication.serializers import RequestResetSerializer


class RequestResetView(APIView):
    serializer_class = RequestResetSerializer

    @extend_schema(
        tags=['Solicitações de Redefinição de Senha'],
        summary='Solicitar redefinição de senha',
        description='Usuário ativo solicita redefinição de senha (email); marca password_reset_requested=True.',
    )
    def post(self, request):
        serializer = RequestResetSerializer(data=request.data, context={})
        serializer.is_valid(raise_exception=True)
        user = serializer.context['user']
        user.password_reset_requested = True
        user.save()
        return Response({'detail': 'Password reset request submitted. An administrator will review and approve it.'})
