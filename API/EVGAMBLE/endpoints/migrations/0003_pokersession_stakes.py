# Generated by Django 5.0.6 on 2024-08-23 23:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('endpoints', '0002_pokersession'),
    ]

    operations = [
        migrations.AddField(
            model_name='pokersession',
            name='stakes',
            field=models.TextField(blank=True, null=True),
        ),
    ]
