from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView, ConfirmEmail, ResetPassword

urlpatterns = [
    path('token', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('send-confirmation-email', ConfirmEmail.as_view(), name='confirm_email'),
    path('reset-password', ResetPassword.as_view(), name='reset_password'),
]
'''
The URL configuration for the auth app. The URLs are as follows:
- token/ - The endpoint to obtain a JWT token.
- token/refresh/ - The endpoint to refresh a JWT token.
- send-confirmation-email/ - The endpoint to send a confirmation email for account activation.
- reset-password/ - The endpoint to reset a user's password.'''