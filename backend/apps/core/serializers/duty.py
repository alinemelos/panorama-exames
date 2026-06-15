from rest_framework import serializers
from apps.core.models import Duty, Machine, Problem
from apps.core.serializers.collection import CollectionSerializer


class DutySerializer(serializers.ModelSerializer):
    collections = CollectionSerializer(many=True, read_only=True)
    total_count = serializers.SerializerMethodField()
    machine_name = serializers.CharField(source='machine.__str__', read_only=True)
    problem_name = serializers.CharField(source='problem.name', read_only=True)

    class Meta:
        model = Duty
        fields = [
            'id', 'machine', 'machine_name', 'problem', 'problem_name',
            'start_date', 'end_date', 'collections', 'total_count',
        ]
        read_only_fields = ['start_date', 'end_date']

    def get_total_count(self, obj) -> int:
        return sum(c.count for c in obj.collections.all())


class DutyCreateSerializer(serializers.Serializer):
    machine = serializers.PrimaryKeyRelatedField(queryset=Machine.objects.all())


class DutyCloseSerializer(serializers.Serializer):
    problem = serializers.PrimaryKeyRelatedField(
        queryset=Problem.objects.all(),
        required=False,
        allow_null=True,
    )

    def validate(self, data):
        duty = self.context['duty']
        total = sum(c.count for c in duty.collections.all())
        if total == 0 and not data.get('problem'):
            raise serializers.ValidationError('Informe o motivo quando o total de exames for zero.')
        return data
