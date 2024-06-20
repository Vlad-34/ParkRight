from torch import nn
from torchvision import models

class Mobilenet_v2(nn.Module):
    '''Wrapper class for mobilenet_v2 model with custom classifier layer.'''
    def __init__(self, num_classes):
        super(Mobilenet_v2, self).__init__()
        self.mobilenet = models.mobilenet_v2(pretrained=True)
        self.mobilenet.classifier[-1] = nn.Linear(self.mobilenet.classifier[-1].in_features, num_classes)

    def forward(self, x):
        '''Forward pass through the network.'''
        return self.mobilenet(x)
    

class Squeezenet(nn.Module):
    '''Wrapper class for squeezenet model with custom classifier layer.'''
    def __init__(self, num_classes, dropout_prob=0.5):
        super(Squeezenet, self).__init__()
        self.squeezenet = models.squeezenet1_1(pretrained=True)
        
        for name, module in self.squeezenet.features.named_children():
            if isinstance(module, nn.Conv2d):
                module.add_module('dropout', nn.Dropout2d(p=dropout_prob))
        
        final_conv = nn.Conv2d(512, num_classes, kernel_size=1)
        self.squeezenet.classifier[1] = final_conv
        
        self.squeezenet.num_classes = num_classes 

    def forward(self, x):
        '''Forward pass through the network.'''
        return self.squeezenet(x)

