from django.forms import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail

from user.models import User

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    '''Custom token serializer to include custom claims in the token.'''
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['is_staff'] = user.is_staff
        token['email'] = user.email
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ConfirmEmail(APIView):
    '''View to confirm an email.'''
    def post(self, request, format=None):
        try:
            user = User.objects.get(email=request.data['email'])
            subject = "Reset Password"
            from_email = 'vlad.ursache777@gmail.com'
            to_email = user.email

            body = """
            <html>
            <body>
            <a href='http://localhost:4173/reset-password/?email={0}'>
            <button style='background-color: #50c878;
            border: none;
            color: #1E1E1E;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px; cursor: pointer;'>
            Click me to reset password
            </button>
            </a>
            </body>
            </html>
            """.format(user.email)

            send_mail(
                subject,
                '',
                from_email,
                [to_email],
                html_message=body,
            )

            return Response({'message': 'Email sent'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
class ResetPassword(APIView):
    '''View to set the `password` field of the user to the new password.'''
    def post(self, request, format=None):
        try:
            user = User.objects.get(email=request.data['email'])
            user.set_password(request.data['password'])
            user.save()
            return Response({'message': 'Password reset'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)