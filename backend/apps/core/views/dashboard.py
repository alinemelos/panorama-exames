from django.db.models import Count, F, Sum
from django.db.models.functions import TruncMonth
from django.utils.text import slugify
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.models import Collection, Duty
from apps.core.views.permissions import IsAdmin

MES_ABBR = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']


class DashboardView(APIView):
    permission_classes = [IsAdmin]

    @extend_schema(responses=OpenApiTypes.OBJECT, tags=['Dashboard'])
    def get(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        exam_id = request.query_params.get('exam_id')
        machine_id = request.query_params.get('machine_id')

        duties_qs = Duty.objects.filter(end_date__isnull=False)
        if date_from:
            duties_qs = duties_qs.filter(start_date__date__gte=date_from)
        if date_to:
            duties_qs = duties_qs.filter(start_date__date__lte=date_to)
        if machine_id:
            duties_qs = duties_qs.filter(machine_id=machine_id)
        if exam_id:
            duties_qs = duties_qs.filter(machine__exam_type_id=exam_id)

        exames_por_mes = (
            Collection.objects.filter(duty__in=duties_qs)
            .annotate(mes=TruncMonth('collection_date'))
            .values('mes')
            .annotate(quantidade=Sum('count'))
            .order_by('mes')
        )

        problems_qs = (
            Duty.objects.filter(end_date__isnull=False, problem__isnull=False)
            .filter(pk__in=duties_qs)
            .annotate(mes=TruncMonth('start_date'))
            .values('mes', 'problem__name')
            .annotate(total=Count('id'))
            .order_by('mes')
        )

        problems_by_month: dict = {}
        problem_types: dict = {}
        for row in problems_qs:
            key = row['mes'].strftime('%Y-%m')
            if key not in problems_by_month:
                problems_by_month[key] = {'mes': MES_ABBR[row['mes'].month - 1]}
            slug = slugify(row['problem__name'])
            problem_types[slug] = row['problem__name']
            problems_by_month[key][slug] = row['total']

        problemas_tipos = [
            {'slug': slug, 'name': name}
            for slug, name in sorted(problem_types.items(), key=lambda item: item[1])
        ]

        exames_result = [
            {'mes': MES_ABBR[row['mes'].month - 1], 'quantidade': row['quantidade']}
            for row in exames_por_mes
        ]

        faturamento = (
            Collection.objects.filter(duty__in=duties_qs)
            .aggregate(total=Sum(F('count') * F('duty__machine__cost')))
        )['total'] or 0

        return Response({
            'exames_por_mes': exames_result,
            'problemas_por_mes': list(problems_by_month.values()),
            'problemas_tipos': problemas_tipos,
            'faturamento': float(faturamento),
        })
