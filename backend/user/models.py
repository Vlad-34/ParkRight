from django.contrib.auth.models import User as BaseUser
from django.contrib.auth.hashers import make_password

# Create your models here.

class User(BaseUser):  
    '''A model that represents a user. The model extends the Django User model and has the following fields:
    - first_name - The first name of the user.
    - last_name - The last name of the user.
    - username - The username of the user.
    - email - The email of the user.
    - is_staff - A boolean field that indicates if the user is a staff member.
    The model also has the following methods:
    - set_password - A method to set the password of the user.
    - __str__ - A method to return a string representation of the user.'''
    first_name = BaseUser.first_name
    last_name = BaseUser.last_name
    username = BaseUser.username
    email = BaseUser.email
    is_staff = BaseUser.is_staff

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self._password = raw_password

    def __str__(self) -> str:
        return self.username + ' | ' + self.email