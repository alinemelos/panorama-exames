from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.core.views.permissions import IsAdmin
from apps.authentication.models import CustomUser
from apps.authentication.serializers import AccessRequestSerializer, AdminSetPasswordSerializer


@extend_schema_view(
    get=extend_schema(
        tags=['Solicitações de Acesso'],
        summary='Listar solicitações de acesso pendentes',
        description='Retorna os usuários inativos que solicitaram acesso e aguardam aprovação de um administrador.',
        responses=AccessRequestSerializer,
    )
)
class AccessRequestListView(generics.ListAPIView):
    serializer_class = AccessRequestSerializer
    permission_classes = [IsAdmin]
    queryset = CustomUser.objects.filter(is_active=False)


class AccessRequestApproveView(APIView):
    serializer_class = AdminSetPasswordSerializer
    permission_classes = [IsAdmin]

    @extend_schema(
        tags=['Solicitações de Acesso'],
        summary='Aprovar solicitação de acesso',
        description='Aprova a solicitação: ativa o usuário e define a senha inicial.',
    )
    def post(self, request, pk):
        user = generics.get_object_or_404(CustomUser, pk=pk, is_active=False)
        serializer = AdminSetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.set_password(serializer.validated_data['password'])
        user.is_active = True
        user.save()
        return Response({'detail': 'Access request approved.'})


class AccessRequestRejectView(APIView):
    permission_classes = [IsAdmin]

    @extend_schema(
        request=None,
        tags=['Solicitações de Acesso'],
        summary='Rejeitar solicitação de acesso',
        description='Rejeita a solicitação, excluindo o usuário pendente.',
    )
    def delete(self, request, pk):
        user = generics.get_object_or_404(CustomUser, pk=pk, is_active=False)
        user.delete()
        return Response({'detail': 'Access request rejected.'}, status=status.HTTP_204_NO_CONTENT)
