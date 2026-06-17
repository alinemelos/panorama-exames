from rest_framework import serializers
from apps.core.models import Machine


class MachineSerializer(serializers.ModelSerializer):
    exam_type_name = serializers.CharField(source='exam_type.name', read_only=True)

    class Meta:
        model = Machine
        fields = ['id', 'name', 'exam_type', 'exam_type_name', 'cost', 'created_date', 'last_edited_date']
        read_only_fields = ['created_date', 'last_edited_date']
