# Generated by Django 5.0.6 on 2024-05-21 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('image_map', '0002_remove_imagemap_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagemap',
            name='image',
            field=models.CharField(default='', max_length=50),
        ),
    ]
