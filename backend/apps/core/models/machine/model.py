from django.conf import settings
from django.db import models

from apps.core.models.exam import Exam


class Machine(models.Model):
    exam_type = models.ForeignKey(Exam, on_delete=models.PROTECT, related_name='machines')
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    created_date = models.DateTimeField(auto_now_add=True)
    last_edited_date = models.DateTimeField(auto_now=True)
    last_edited_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='edited_machines',
    )

    def __str__(self):
        return f'{self.exam_type.name} #{self.pk}'
