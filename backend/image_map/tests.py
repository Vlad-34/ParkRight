from uuid import UUID
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from rest_framework.test import APIClient
from scooter.models import Scooter
from user.models import User as CustomUser
from .models import ImageMap
from .serializers import ImageMapSerializer

class ImageMapAPITests(TestCase):
    '''Test cases for the ImageMap API, covering creation, retrieval, deletion, and filtering by time.'''
    def setUp(self):
        self.admin_user = CustomUser.objects.create_superuser(
            username='admin', email='admin@gmail.com', password='AdMiNpAsSwOrD')
        self.admin_user.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin_user)
        
        self.scooter = Scooter.objects.create(name='Scooty McScootface')
        self.scooter.save()

        self.image_map = ImageMap.objects.create(
            scooter_id=self.scooter,
            user_id=self.admin_user,
            prediction='Good',
            image=UUID('12345678-1234-5678-1234-567812345678'),
            timestamp=timezone.now() - timedelta(days=1)
        )
        self.image_map.save()
        self.list_url = reverse('image-maps')
        self.filter_url = reverse('image-map', kwargs={'value': 'scooter', 'id': self.scooter.id, 'time': 'week'})

    def test_create_image_map(self):
        new_data = {
            'nickname': self.scooter.name,
            'user_id': self.admin_user.id,
            'prediction': 'Bad',
            'image_name': UUID('12345678-1234-5678-1234-567812345678'),
            'timestamp': timezone.now()
        }
        response = self.client.post(self.list_url, new_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ImageMap.objects.count(), 2)

    def test_filter_image_map_by_scooter_and_time(self):
        response = self.client.get(self.filter_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_maps = ImageMap.objects.filter(scooter_id=self.scooter.id,  timestamp__gte = timezone.now() - timedelta(days=7))
        serializer = ImageMapSerializer(expected_maps, many=True)
        self.assertEqual(response.data, serializer.data)
