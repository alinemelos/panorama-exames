import random
from datetime import timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.core.models import Collection, Duty, Exam, Machine, Problem


class Command(BaseCommand):
    help = 'Popula o banco com dados simulados de máquinas, plantões e coletas para testes.'

    def handle(self, *args, **options):
        self.stdout.write('Limpando dados de exemplo anteriores...')
        Duty.objects.all().delete()
        Machine.objects.all().delete()

        tomografia, _ = Exam.objects.get_or_create(name='Tomografia')
        raio_x, _ = Exam.objects.get_or_create(name='Raio X')

        manutencao, _ = Problem.objects.get_or_create(name='Equipamento em manutenção')
        infraestrutura, _ = Problem.objects.get_or_create(name='Problema de infraestrutura')
        problemas = [manutencao, infraestrutura]

        machines = self._create_machines(tomografia, raio_x)

        today = timezone.now()
        for machine in machines:
            self._create_history_duties(machine, problemas, today)
            self._create_open_duty(machine, today)

        self.stdout.write(self.style.SUCCESS('Dados de exemplo criados com sucesso.'))

    def _create_machines(self, tomografia, raio_x):
        specs = [
            ('Tomógrafo 1', tomografia),
            ('Tomógrafo 2', tomografia),
            ('Raio X 1', raio_x),
            ('Raio X 2', raio_x),
        ]
        return [
            Machine.objects.create(
                name=name,
                exam_type=exam_type,
                cost=Decimal(str(round(random.uniform(80, 600), 2))),
            )
            for name, exam_type in specs
        ]

    def _create_history_duties(self, machine, problemas, today):
        for _ in range(10):
            start = today - timedelta(days=random.randint(1, 180), hours=random.randint(0, 23))
            end = start + timedelta(hours=random.randint(4, 12))

            duty = Duty.objects.create(machine=machine)

            if random.random() < 0.2:
                Duty.objects.filter(pk=duty.pk).update(
                    start_date=start,
                    end_date=end,
                    problem=random.choice(problemas),
                )
            else:
                Duty.objects.filter(pk=duty.pk).update(start_date=start, end_date=end)
                duration_minutes = max(int((end - start).total_seconds() // 60), 1)
                for _ in range(random.randint(1, 5)):
                    collection_date = start + timedelta(minutes=random.randint(0, duration_minutes))
                    collection = Collection.objects.create(duty=duty, count=random.randint(1, 30))
                    Collection.objects.filter(pk=collection.pk).update(collection_date=collection_date)

    def _create_open_duty(self, machine, today):
        duty = Duty.objects.create(machine=machine)
        Duty.objects.filter(pk=duty.pk).update(start_date=today)
