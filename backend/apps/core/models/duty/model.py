from django.conf import settings
from django.db import models

from apps.core.models.machine import Machine
from apps.core.models.problem import Problem


class Duty(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.PROTECT, related_name='duties')
    problem = models.ForeignKey(Problem, on_delete=models.SET_NULL, null=True, blank=True, related_name='duties')
    nurse = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='duties',
    )
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Duty {self.pk} - {self.machine}'
