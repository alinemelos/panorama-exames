from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from apps.core.models import Exam
from apps.core.serializers import ExamSerializer
from apps.core.views.permissions import IsAdmin


@extend_schema_view(
    get=extend_schema(tags=['Exames']),
    post=extend_schema(tags=['Exames']),
)
class ExamListCreateView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdmin()]


@extend_schema_view(
    get=extend_schema(tags=['Exames']),
    put=extend_schema(tags=['Exames']),
    patch=extend_schema(tags=['Exames']),
    delete=extend_schema(tags=['Exames']),
)
class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdmin()]
