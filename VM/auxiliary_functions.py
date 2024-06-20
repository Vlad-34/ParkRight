from torch import no_grad, max, optim
import torchmetrics


def val_function(val_loader, model, val_accuracy, val_losses, criterion, num_classes, device):
    '''Validation function. Computes the loss and accuracy on the validation set.'''
    model.eval()

    accuracy_metric = torchmetrics.Accuracy(task="binary", num_classes=num_classes).to(device)
    precision_metric = torchmetrics.Precision(task="binary", num_classes=num_classes, average='macro').to(device)
    recall_metric = torchmetrics.Recall(task="binary", num_classes=num_classes, average='macro').to(device)
    f1_score_metric = torchmetrics.F1Score(task="binary", num_classes=num_classes, average='macro').to(device)
    confusion_matrix_metric = torchmetrics.ConfusionMatrix(task="binary", num_classes=num_classes).to(device)

    with no_grad():
        '''Validation loop. Computes the loss and accuracy on the validation set.'''
        total_loss = 0
        for inputs, labels in val_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            outputs = model(inputs)
            loss = criterion(outputs, labels)
            total_loss += loss.item()

            _, predicted = max(outputs.data, 1)
            accuracy_metric.update(predicted, labels)
            precision_metric.update(predicted, labels)
            recall_metric.update(predicted, labels)
            f1_score_metric.update(predicted, labels)
            confusion_matrix_metric.update(predicted, labels)            

    total_loss = total_loss / len(val_loader)
    val_losses.append(total_loss)
    accuracy = accuracy_metric.compute()
    val_accuracy.append(accuracy)
    precision = precision_metric.compute()
    recall = recall_metric.compute()
    f1_score = f1_score_metric.compute()
    confusion_matrix = confusion_matrix_metric.compute()

    print(confusion_matrix)
    print('Validation [Loss: {:.4f}, Accuracy: {:.2f}%, Precision: {:.2f}%, Recall: {:.2f}%, F1_score: {:.2f}%]'.format(total_loss, accuracy * 100, precision * 100, recall * 100, f1_score * 100))


def test_function(test_loader, model, num_classes, device, classes):
    '''Test function. Computes the accuracy on the test set. Prints the accuracy for each class.'''
    model.eval()

    accuracy_metric = torchmetrics.Accuracy(task="binary", num_classes=num_classes).to(device)
    precision_metric = torchmetrics.Precision(task="binary", num_classes=num_classes, average='macro').to(device)
    recall_metric = torchmetrics.Recall(task="binary", num_classes=num_classes, average='macro').to(device)
    f1_score_metric = torchmetrics.F1Score(task="binary", num_classes=num_classes, average='macro').to(device)

    correct_pred = {classname: 0 for classname in classes}
    total_pred = {classname: 0 for classname in classes}

    with no_grad():
        for _, (inputs, labels) in enumerate(test_loader):
            inputs = inputs.to(device)
            labels = labels.to(device)
            outputs = model(inputs)
            _, predicted = max(outputs, 1)

            accuracy_metric.update(predicted, labels)
            precision_metric.update(predicted, labels)
            recall_metric.update(predicted, labels)
            f1_score_metric.update(predicted, labels)

            for label, prediction in zip(labels, predicted):
                if label == prediction:
                    correct_pred[classes[label]] += 1
                total_pred[classes[label]] += 1

    accuracy = accuracy_metric.compute() * 100
    precision = precision_metric.compute() * 100
    recall = recall_metric.compute() * 100
    f1_score = f1_score_metric.compute() * 100

    accuracy_metric.reset()
    precision_metric.reset()
    recall_metric.reset()
    f1_score_metric.reset()

    print(f'Accuracy: {accuracy:.2f}')
    print(f'Precision: {precision:.2f}')
    print(f'Recall: {recall:.2f}')
    print(f'F1 Score: {f1_score:.2f}')

    for classname, correct_count in correct_pred.items():
        accuracy = 100 * float(correct_count) / total_pred[classname]
        if classname == 'good':
            print(f'True positive rate: {accuracy:.1f}%')
        elif classname == 'bad':
            print(f'True negative rate: {accuracy:.1f}%')


def calculate_learning_rate(epoch_index, learning_rate, val_losses, epoch_treshold, learning_rate_variation):
    '''Calculates the learning rate. If the validation loss does not decrease for a certain number of epochs, the learning rate is decreased.'''
    if epoch_index > epoch_treshold and val_losses[epoch_index - 1] >= min(val_losses):
            return learning_rate * learning_rate_variation
    return learning_rate


def train_function(train_loader, val_loader, num_epochs, model, criterion, train_accuracy, val_accuracy, train_losses, val_losses, num_classes, device, learning_rate, weight_decay, epoch_treshold, learning_rate_variation):
    '''Training function. Trains the model and computes the loss and accuracy on the training set. Calls the validation function.'''
    accuracy_metric = torchmetrics.Accuracy(task="multiclass", num_classes=num_classes).to(device)
    for epoch in range(num_epochs):
        optimizer = optim.Adam(model.parameters(), lr=calculate_learning_rate(epoch, learning_rate, val_losses, epoch_treshold, learning_rate_variation), weight_decay=weight_decay)
        loss_acc = 0
        model.train()
        for _, (inputs, labels) in enumerate(train_loader):
            inputs = inputs.to(device)
            labels = labels.to(device)
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss_acc += loss.item()
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            _, predicted = max(outputs, 1)
            accuracy_metric.update(predicted, labels)

        train_losses.append((loss / len(train_loader)).detach().numpy())
        accuracy = accuracy_metric.compute()
        train_accuracy.append(accuracy)
        print('Train [E {}, Accuracy: {:.2f}%]'.format(epoch + 1, accuracy * 100))
        accuracy_metric.reset()
        val_function(val_loader, model, val_accuracy, val_losses, criterion, num_classes, device)
