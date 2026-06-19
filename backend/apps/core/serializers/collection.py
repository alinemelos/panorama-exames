from rest_framework import serializers
from apps.core.models import Collection


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id', 'count', 'cost', 'collection_date']
        read_only_fields = ['cost', 'collection_date']
