import os
import torch
import torchmetrics
import logging
from predict.model import get_prediction_for_image

logging.basicConfig(filename='prediction.log', level=logging.INFO, filemode='w', format='%(asctime)s - %(message)s')

def process_images_in_folder(folder_path):
    y_true = []
    y_pred = []
    for filename in os.listdir(folder_path):
        if filename.endswith('.jpg') or filename.endswith('.png'):
            image_path = os.path.join(folder_path, filename)

            prediction = get_prediction_for_image(image_path)
            y_pred.append(1 if prediction['predicted_class'] == 'good' else 0)
            logging.info(f"File: {filename}, Prediction: {prediction}")
            if 'good' in filename:
                y_true.append(1)
            elif 'bad' in filename:
                y_true.append(0)
    return torch.tensor(y_true), torch.tensor(y_pred)

if __name__ == "__main__":
    folder_path = "C:/Users/Vlad Ursache/Desktop/LicentaVU/backend/testing_images"
    y_true, y_pred = process_images_in_folder(folder_path)

    accuracy = torchmetrics.Accuracy(average='macro', task='binary')
    print(f"Accuracy: {accuracy(y_pred, y_true)}")
    logging.info(f"Accuracy: {accuracy(y_pred, y_true)}")

    precision = torchmetrics.Precision(average='macro', task='binary')
    print(f"Precision: {precision(y_pred, y_true)}")
    logging.info(f"Precision: {precision(y_pred, y_true)}")

    recall = torchmetrics.Recall(average='macro', task='binary')
    print(f"Recall: {recall(y_pred, y_true)}")
    logging.info(f"Recall: {recall(y_pred, y_true)}")

    f1 = torchmetrics.F1Score(average='macro', task='binary')
    print(f"F1 Score: {f1(y_pred, y_true)}")
    logging.info(f"F1 Score: {f1(y_pred, y_true)}")

    confusion_matrix = torchmetrics.ConfusionMatrix(task='binary')
    print(f"Confusion Matrix:\n {confusion_matrix(y_pred, y_true)}")
    logging.info(f"Confusion Matrix:\n {confusion_matrix(y_pred, y_true)}")