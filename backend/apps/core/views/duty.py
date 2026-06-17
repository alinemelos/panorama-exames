from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from apps.core.models import Duty
from apps.core.serializers import CollectionSerializer, DutyCloseSerializer, DutyCreateSerializer, DutySerializer


class DutyCreateView(APIView):
    permission_classes = [AllowAny]
    serializer_class = DutyCreateSerializer

    @extend_schema(tags=['Plantões'])
    def post(self, request):
        serializer = DutyCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        machine = serializer.validated_data['machine']
        open_duty = Duty.objects.filter(machine=machine, end_date__isnull=True).first()
        if open_duty:
            return Response(
                {'detail': 'Essa máquina já tem um plantão aberto.', 'duty_id': open_duty.pk},
                status=status.HTTP_400_BAD_REQUEST,
            )

        duty = Duty.objects.create(machine=machine)
        return Response(DutySerializer(duty).data, status=status.HTTP_201_CREATED)


class DutyCurrentView(APIView):
    permission_classes = [AllowAny]
    serializer_class = DutySerializer

    @extend_schema(tags=['Plantões'])
    def get(self, request):
        machine_id = request.query_params.get('machine_id')
        if not machine_id:
            return Response({'detail': 'Informe machine_id.'}, status=status.HTTP_400_BAD_REQUEST)

        duty = (
            Duty.objects.filter(machine_id=machine_id, end_date__isnull=True)
            .prefetch_related('collections')
            .first()
        )
        if not duty:
            return Response({'detail': 'Nenhum plantão aberto.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(DutySerializer(duty).data)


class DutyDetailView(APIView):
    permission_classes = [AllowAny]
    serializer_class = DutySerializer

    @extend_schema(tags=['Plantões'])
    def get(self, request, pk):
        try:
            duty = Duty.objects.prefetch_related('collections').get(pk=pk)
        except Duty.DoesNotExist:
            return Response({'detail': 'Plantão não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(DutySerializer(duty).data)


class DutyCollectionsView(APIView):
    permission_classes = [AllowAny]
    serializer_class = CollectionSerializer

    @extend_schema(tags=['Plantões'])
    def get(self, request, pk):
        try:
            duty = Duty.objects.get(pk=pk)
        except Duty.DoesNotExist:
            return Response({'detail': 'Plantão não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(CollectionSerializer(duty.collections.all(), many=True).data)

    @extend_schema(tags=['Plantões'])
    def post(self, request, pk):
        try:
            duty = Duty.objects.get(pk=pk, end_date__isnull=True)
        except Duty.DoesNotExist:
            return Response({'detail': 'Plantão não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CollectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        collection = serializer.save(duty=duty)
        return Response(CollectionSerializer(collection).data, status=status.HTTP_201_CREATED)


class DutyCloseView(APIView):
    permission_classes = [AllowAny]
    serializer_class = DutyCloseSerializer

    @extend_schema(tags=['Plantões'])
    def patch(self, request, pk):
        try:
            duty = Duty.objects.prefetch_related('collections').get(pk=pk, end_date__isnull=True)
        except Duty.DoesNotExist:
            return Response({'detail': 'Plantão não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DutyCloseSerializer(data=request.data, context={'duty': duty})
        serializer.is_valid(raise_exception=True)

        duty.end_date = timezone.now()
        duty.problem = serializer.validated_data.get('problem')
        duty.save()
        return Response(DutySerializer(duty).data)
