from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User

class PredictViewTests(TestCase):
    '''A test case for the predict view. The test case has the following methods:
    - setUp - A method that sets up the test case.
    - test_predict_view_post_authenticated - A method that tests the predict view with an authenticated user.
    - test_predict_view_post_unauthenticated - A method that tests the predict view with an unauthenticated user.'''
    def setUp(self):
        self.user = User.objects.create_user(username='vladu', password='PaSsWoRd')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.url = reverse('predict')
        self.mock_image_data = {'image': 'predict/imagetest.jpg'}

    def test_predict_view_post_authenticated(self):
        response = self.client.post(self.url, self.mock_image_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_predict_view_post_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.url, self.mock_image_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

