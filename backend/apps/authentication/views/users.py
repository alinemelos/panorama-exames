from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.core.views.permissions import IsAdmin
from apps.authentication.models import CustomUser
from apps.authentication.serializers import UserListSerializer


@extend_schema_view(
    get=extend_schema(
        tags=['Usuários'],
        summary='Listar usuários',
        description='Retorna todos os usuários cadastrados.',
        responses=UserListSerializer,
    )
)
class UserListView(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAdmin]
    queryset = CustomUser.objects.all().order_by('-created_at')


class UserDeleteView(APIView):
    permission_classes = [IsAdmin]

    @extend_schema(
        request=None,
        tags=['Usuários'],
        summary='Deletar usuário',
        description='Remove um usuário já ativo do sistema. Um administrador não pode deletar a própria conta.',
    )
    def delete(self, request, pk):
        if int(pk) == request.user.id:
            return Response({'detail': 'Você não pode deletar sua própria conta.'}, status=status.HTTP_400_BAD_REQUEST)
        user = generics.get_object_or_404(CustomUser, pk=pk, is_active=True)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
