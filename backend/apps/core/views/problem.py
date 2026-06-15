from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from apps.core.models import Problem
from apps.core.serializers import ProblemSerializer


@extend_schema_view(
    get=extend_schema(tags=['Problemas']),
)
class ProblemListView(generics.ListAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [IsAuthenticated]
