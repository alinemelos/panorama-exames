from rest_framework import serializers
from apps.core.models import Problem


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = ['id', 'name']
