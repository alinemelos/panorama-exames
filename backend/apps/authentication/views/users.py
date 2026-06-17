from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics
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
