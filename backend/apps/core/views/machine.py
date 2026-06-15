from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from apps.core.models import Machine
from apps.core.serializers import MachineSerializer


@extend_schema_view(
    get=extend_schema(tags=['Máquinas']),
    post=extend_schema(tags=['Máquinas']),
)
class MachineListCreateView(generics.ListCreateAPIView):
    queryset = Machine.objects.select_related('exam_type').all()
    serializer_class = MachineSerializer
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(last_edited_user=self.request.user)
