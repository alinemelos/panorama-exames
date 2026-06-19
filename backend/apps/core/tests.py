from django.utils import timezone
from rest_framework.test import APITestCase

from apps.authentication.models import CustomUser
from apps.core.models import Collection, Duty, Exam, Machine


class CollectionCostSnapshotTest(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(email='admin@test.com', name='Admin', is_active=True)
        self.client.force_authenticate(self.user)

        self.exam = Exam.objects.create(name='Tomografia')
        self.machine = Machine.objects.create(name='HCPE-0001', exam_type=self.exam, cost='100.00')
        self.duty = Duty.objects.create(machine=self.machine)

    def test_collection_keeps_price_charged_at_creation_time(self):
        self.client.post(f'/api/v1/core/duties/{self.duty.pk}/collections/', {'count': 10})

        self.machine.cost = '300.00'
        self.machine.save()

        self.client.post(f'/api/v1/core/duties/{self.duty.pk}/collections/', {'count': 5})

        self.duty.end_date = timezone.now()
        self.duty.save()

        collections = Collection.objects.filter(duty=self.duty).order_by('id')
        self.assertEqual(collections[0].cost, 100)
        self.assertEqual(collections[1].cost, 300)

        response = self.client.get('/api/v1/core/dashboard/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['faturamento'], 2500)
