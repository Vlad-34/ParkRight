from rest_framework.serializers import ModelSerializer
from .models import ImageMap

class ImageMapSerializer(ModelSerializer):
    class Meta:
        model = ImageMap
        fields = '__all__'