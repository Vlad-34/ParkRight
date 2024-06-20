import torch
from PIL import Image
import torchvision.transforms as transforms
import torch.nn as nn
import torchvision.models as models
from torchvision.models.squeezenet import SqueezeNet1_1_Weights

class SqueezeNetCNN(torch.nn.Module):
    '''A custom CNN model based on Squeezenet. The model has the following layers:
    - Squeezenet features - The feature extractor of the Squeezenet model.
    - Dropout - A dropout layer to prevent overfitting.
    - Final Convolution - A final convolution layer with a kernel size of 1.
    - Dropout - Another dropout layer to prevent overfitting.
    The model has the following methods:
    - forward - The forward pass of the model. It takes an input tensor and returns the output tensor.
    The model is used to classify images into two classes: good and bad.
    The model is trained on a dataset of scooter images.
    The model is saved to the `VU_model.pth` file.
    The model is loaded from the `VU_model.pth` file.
    The model is used to make predictions on new images.'''
    def __init__(self, num_classes, dropout_prob=0.5):
        super(SqueezeNetCNN, self).__init__()

        self.squeezenet = models.squeezenet1_1(weights=SqueezeNet1_1_Weights.DEFAULT)

        for idx, module in self.squeezenet.features.named_children():
            if isinstance(module, torch.nn.Conv2d):
                module.add_module("dropout", torch.nn.Dropout(p=dropout_prob))

        final_conv = torch.nn.Conv2d(512, num_classes, kernel_size=1)
        self.squeezenet.classifier[1] = final_conv
        self.squeezenet.num_classes = num_classes
        self.dropout = nn.Dropout(dropout_prob)

    def forward(self, x):
        x = self.squeezenet(x)
        x = self.dropout(x)
        return x

def preprocess_image(image_path, device):
    '''Preprocess an image for prediction. The image is resized to 60x80 pixels and normalized using the mean and standard deviation of the training dataset.'''

    transform = transforms.Compose([
        transforms.Resize((60, 80)),
        transforms.ToTensor(),
        transforms.Normalize((0.5580, 0.5417, 0.5160),
                             (0.2349, 0.2252, 0.2226))
    ])

    image = Image.open(image_path)
    image = transform(image).unsqueeze(0).to(device)
    return image

model = SqueezeNetCNN(num_classes=2)

model.load_state_dict(torch.load('./predict/VU_model.pth', map_location=torch.device('cpu')))
# model.load_state_dict(torch.load('C:/Users/Vlad Ursache/Desktop/LicentaVU/backend/predict/VU_model.pth', map_location=torch.device('cpu')))
model.eval()

device = torch.device("cpu")

def get_prediction(image_path):
    '''Get a prediction for an image. The image is preprocessed and passed through the model to get the predicted class and confidence rate.'''
    image = preprocess_image(image_path, device)
    with torch.no_grad():
        outputs = model(image)
        probabilities = torch.softmax(outputs, dim=1)
        predicted_class = torch.argmax(outputs).item()
        confidence_rate = probabilities[0, predicted_class].item()

    return predicted_class, confidence_rate

classes = ['bad', 'good']

def get_prediction_for_image(image_path):
    '''Get a prediction for an image and return the predicted class and confidence rate.'''
    predicted_class, confidence_rate = get_prediction(image_path)
    return {
        "predicted_class": str(classes[predicted_class])
    }