from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_backfill_collection_cost'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='cost',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
    ]
