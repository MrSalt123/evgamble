# Generated by Django 5.0.6 on 2024-05-12 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='VerificationCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=64)),
                ('code', models.CharField(max_length=8)),
            ],
            options={
                'db_table': 'RegistrationCodes',
            },
        ),
    ]
