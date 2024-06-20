from rest_framework.serializers import ModelSerializer
from .models import Scooter

class ScooterSerializer(ModelSerializer):
    class Meta:
        model = Scooter
        fields = '__all__'