from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from user.models import User


class ConfirmEmailTest(TestCase):
    '''Test case for the confirm email view with a user that exists and a user that does not exist.'''
    def setUp(self):
        self.client = Client()
        self.confirm_email_url = reverse('confirm_email')
        self.user = User.objects.create_user(email='vlad.ursache777@gmail.com', username='vladu')

    def test_confirm_email(self):
        response = self.client.post(self.confirm_email_url, {
            'email': 'vlad.ursache777@gmail.com',
            'username': 'vladu'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_confirm_email_user_not_found(self):
        response = self.client.post(self.confirm_email_url, {
            'email': 'vladureche@gmail.com',
            'username': 'vladd'
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ResetPasswordTest(TestCase):
    '''Test case for the reset password view with a user that exists and a user that does not exist.'''
    def setUp(self):
        self.client = Client()
        self.reset_password_url = reverse('reset_password')
        self.user = User.objects.create_user(email='vlad.ursache777@gmail.com', username='vladu', password='OlDpAsSwOrD')

    def test_reset_password(self):
        response = self.client.post(self.reset_password_url, {
            'email': 'vlad.ursache777@gmail.com',
            'password': 'NeWpAsSwOrD'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NeWpAsSwOrD'))

    def test_reset_password_user_not_found(self):
        response = self.client.post(self.reset_password_url, {
            'email': 'vladureche@gmail.com',
            'password': 'NeWpAsSwOrD'
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)