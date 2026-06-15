from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from apps.core.models import Duty
from apps.core.serializers import CollectionSerializer, DutyCloseSerializer, DutyCreateSerializer, DutySerializer


class DutyCreateView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DutyCreateSerializer

    @extend_schema(tags=['Plantões'])
    def post(self, request):
        open_duty = Duty.objects.filter(nurse=request.user, end_date__isnull=True).first()
        if open_duty:
            return Response(
                {'detail': 'Você já tem um plantão aberto.', 'duty_id': open_duty.pk},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = DutyCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        duty = Duty.objects.create(
            nurse=request.user,
            machine=serializer.validated_data['machine'],
        )
        return Response(DutySerializer(duty).data, status=status.HTTP_201_CREATED)


class DutyCurrentView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DutySerializer

    @extend_schema(tags=['Plantões'])
    def get(self, request):
        duty = Duty.objects.filter(nurse=request.user, end_date__isnull=True).prefetch_related('collections').first()
        if not duty:
            return Response({'detail': 'Nenhum plantão aberto.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(DutySerializer(duty).data)


class DutyAddCollectionView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CollectionSerializer

    @extend_schema(tags=['Plantões'])
    def post(self, request, pk):
        try:
            duty = Duty.objects.get(pk=pk, nurse=request.user, end_date__isnull=True)
        except Duty.DoesNotExist:
            return Response({'detail': 'Plantão não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CollectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        collection = serializer.save(duty=duty)
        return Response(CollectionSerializer(collection).data, status=status.HTTP_201_CREATED)


class DutyCloseView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DutyCloseSerializer

    @extend_schema(tags=['Plantões'])
    def patch(self, request, pk):
        try:
            duty = Duty.objects.prefetch_related('collections').get(
                pk=pk, nurse=request.user, end_date__isnull=True
            )
        except Duty.DoesNotExist:
            return Response({'detail': 'Plantão não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DutyCloseSerializer(data=request.data, context={'duty': duty})
        serializer.is_valid(raise_exception=True)

        duty.end_date = timezone.now()
        duty.problem = serializer.validated_data.get('problem')
        duty.save()
        return Response(DutySerializer(duty).data)
