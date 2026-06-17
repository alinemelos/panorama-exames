from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_remove_exam_cost'),
    ]

    operations = [
        migrations.AddField(
            model_name='machine',
            name='name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
