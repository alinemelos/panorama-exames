from django.db import migrations


def backfill_collection_cost(apps, schema_editor):
    Collection = apps.get_model('core', 'Collection')
    for collection in Collection.objects.select_related('duty__machine').filter(cost__isnull=True):
        collection.cost = collection.duty.machine.cost
        collection.save(update_fields=['cost'])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_collection_cost'),
    ]

    operations = [
        migrations.RunPython(backfill_collection_cost, noop_reverse),
    ]
