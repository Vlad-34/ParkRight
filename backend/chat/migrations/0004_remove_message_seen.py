# Generated by Django 5.0.6 on 2024-06-07 12:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_alter_message_receiver_alter_message_sender'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='seen',
        ),
    ]
