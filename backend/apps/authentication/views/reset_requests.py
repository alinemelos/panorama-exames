from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.core.views.permissions import IsAdmin
from apps.authentication.models import CustomUser
from apps.authentication.serializers import ResetRequestSerializer, AdminSetPasswordSerializer


@extend_schema_view(
    get=extend_schema(
        tags=['Autenticação'],
        summary='Listar solicitações de redefinição de senha pendentes',
        description='Retorna os usuários ativos que solicitaram redefinição de senha e aguardam aprovação de um administrador.',
        responses=ResetRequestSerializer,
    )
)
class ResetRequestListView(generics.ListAPIView):
    serializer_class = ResetRequestSerializer
    permission_classes = [IsAdmin]
    queryset = CustomUser.objects.filter(password_reset_requested=True)


class ResetRequestApproveView(APIView):
    serializer_class = AdminSetPasswordSerializer
    permission_classes = [IsAdmin]

    @extend_schema(tags=['Autenticação'])
    def post(self, request, pk):
        user = generics.get_object_or_404(CustomUser, pk=pk, password_reset_requested=True)
        serializer = AdminSetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.set_password(serializer.validated_data['password'])
        user.password_reset_requested = False
        user.save()
        return Response({'detail': 'Password reset approved.'})


class ResetRequestRejectView(APIView):
    permission_classes = [IsAdmin]

    @extend_schema(request=None, tags=['Autenticação'])
    def post(self, request, pk):
        user = generics.get_object_or_404(CustomUser, pk=pk, password_reset_requested=True)
        user.password_reset_requested = False
        user.save()
        return Response({'detail': 'Password reset request rejected.'})
