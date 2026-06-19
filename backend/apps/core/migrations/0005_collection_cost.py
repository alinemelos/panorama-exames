from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_remove_duty_nurse'),
    ]

    operations = [
        migrations.AddField(
            model_name='collection',
            name='cost',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
    ]
