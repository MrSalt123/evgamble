# Generated by Django 5.0.6 on 2024-05-16 02:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('endpoints', '0003_user_promotions'),
    ]

    operations = [
        migrations.DeleteModel(
            name='User',
        ),
    ]
