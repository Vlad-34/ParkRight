from rest_framework.response import Response
from rest_framework.views import APIView
from . import model
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@permission_classes([IsAuthenticated])
class PredictView(APIView):
    '''A view that returns the prediction for an image. The view requires the user to be authenticated.'''
    def post(self, request):
        data = request.data
        return Response(model.get_prediction_for_image(data.get('image')))