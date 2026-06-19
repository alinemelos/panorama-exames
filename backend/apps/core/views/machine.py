from django.db.models import ProtectedError
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.core.models import Machine
from apps.core.serializers import MachineSerializer
from apps.core.views.permissions import IsAdmin


@extend_schema_view(
    get=extend_schema(tags=['Máquinas']),
    post=extend_schema(tags=['Máquinas']),
)
class MachineListCreateView(generics.ListCreateAPIView):
    queryset = Machine.objects.select_related('exam_type').all()
    serializer_class = MachineSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdmin()]

    def perform_create(self, serializer):
        serializer.save(last_edited_user=self.request.user)


@extend_schema_view(
    get=extend_schema(tags=['Máquinas']),
    put=extend_schema(tags=['Máquinas']),
    patch=extend_schema(tags=['Máquinas']),
    delete=extend_schema(tags=['Máquinas']),
)
class MachineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Machine.objects.select_related('exam_type').all()
    serializer_class = MachineSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdmin()]

    def perform_update(self, serializer):
        serializer.save(last_edited_user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {'detail': 'Não é possível deletar uma máquina com plantões registrados.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
