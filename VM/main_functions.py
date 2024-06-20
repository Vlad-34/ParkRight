from torchvision import transforms, datasets
from matplotlib import pyplot as plt
import numpy as np
from torch import utils, nn
from torch.utils.data import DataLoader

from auxiliary_functions import test_function, train_function

def get_dataset(dataset_path, resize_tuple, mean, std):
    '''Returns a dataset object with the specified transformations.'''
    transform = transforms.Compose([
        transforms.Resize(resize_tuple),
        transforms.ToTensor(),
        transforms.Normalize(mean, std)
    ])
    return datasets.ImageFolder(root=dataset_path, transform=transform)


def inspect_dataset(dataset, image_index):
    '''Displays the image and its class from the dataset.'''
    classes = dataset.classes
    sample, gt = dataset[image_index]
    sample = np.transpose(sample.numpy(), (1, 2, 0))

    print('Sample shape is: ', sample.shape)
    print('Max intensity: ', sample.max())
    print('Min intensity: ', sample.min())
    print('The class is: ', classes[gt], '\n\n')

    _, ax = plt.subplots(figsize=(4, 3))
    ax.imshow(sample)
    ax.set_axis_off()
    plt.show()


def calculate_mean_std(loader):
    '''Calculates the mean and standard deviation of the dataset.'''
    mean = 0.
    std = 0.
    total_images_count = 0

    for images, _ in loader:
        batch_samples = images.size(0)
        images = images.view(batch_samples, images.size(1), -1)
        mean += images.mean(2).sum(0)
        std += images.std(2).sum(0)
        total_images_count += batch_samples

    mean /= total_images_count
    std /= total_images_count

    return mean, std


def dataset_split(dataset, train_split_size, val_split_size, num_workers):
    '''Splits the dataset into training, validation and test sets.'''
    train_size = int(train_split_size * len(dataset))
    val_size = int(val_split_size * len(dataset))
    test_size = len(dataset) - train_size - val_size

    train_dataset, val_dataset, test_dataset = utils.data.random_split(dataset, [train_size, val_size, test_size])

    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True, num_workers=num_workers, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=64, shuffle=False, num_workers=num_workers, pin_memory=True)
    test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False, num_workers=num_workers, pin_memory=True)
    
    return train_loader, val_loader, test_loader


def train_and_test_model(train_loader, val_loader, test_loader, num_epochs, model, learning_rate, num_classes, device, classes, weight_decay, epoch_treshold, learning_rate_variation):
    '''Trains and tests the model.'''
    criterion = nn.CrossEntropyLoss()
    
    train_accuracy = []
    val_accuracy = []
    train_losses = []
    val_losses = []

    train_function(train_loader, val_loader, num_epochs, model, criterion, train_accuracy,val_accuracy, train_losses, val_losses, num_classes, device, learning_rate, weight_decay, epoch_treshold, learning_rate_variation)
    test_function(test_loader, model, num_classes, device, classes)

    return train_accuracy, val_accuracy, train_losses, val_losses


def ploting_values(train_accuracy, val_accuracy, train_losses, val_losses):
    '''Plots the training and validation accuracy and loss.'''
    plt.plot(train_accuracy, label='train')
    plt.plot(val_accuracy, label='validation')
    plt.title('Training and Validation Accuracy')
    plt.legend()
    plt.show()

    plt.plot(train_losses, label='train')
    plt.plot(val_losses, label='validation')
    plt.title('Training and Validation Loss')
    plt.legend()
    plt.ylim(0,1)
    plt.show()