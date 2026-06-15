from django.db import models

from apps.core.models.duty import Duty


class Collection(models.Model):
    duty = models.ForeignKey(Duty, on_delete=models.CASCADE, related_name='collections')
    count = models.PositiveIntegerField()
    collection_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Collection {self.pk} - {self.count} exams'
