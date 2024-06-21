from PIL import Image, ImageEnhance
import os
import random

def augment_images(input_folder, output_folder, rotation_range=30, num_copies=11):
    """
    Augment images by flipping horizontally, varying brightness of each color channel independently,
    and rotating within a specified range, generating multiple copies of each original image
    to reach a target dataset size.

    :param input_folder: str, the path to the directory containing images to augment
    :param output_folder: str, the path to the directory where augmented images will be saved
    :param rotation_range: int, the range of degrees to rotate the image, default is 30 degrees
    :param num_copies: int, the number of augmented copies to produce per original image
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    file_counter = 0

    for filename in os.listdir(input_folder):
        extension = filename.lower().split('.')[-1]
        if extension in ('jpg', 'jpeg'):
            img_path = os.path.join(input_folder, filename)
            with Image.open(img_path) as img:
                for _ in range(num_copies):
                    transformed_img = img.transpose(Image.FLIP_LEFT_RIGHT) if random.random() > 0.5 else img

                    r, g, b = transformed_img.split()
                    r = ImageEnhance.Brightness(r).enhance(random.uniform(0.9, 1.1))
                    g = ImageEnhance.Brightness(g).enhance(random.uniform(0.9, 1.1))
                    b = ImageEnhance.Brightness(b).enhance(random.uniform(0.9, 1.1))
                    transformed_img = Image.merge("RGB", (r, g, b))

                    rotation_degrees = random.uniform(-rotation_range, rotation_range)
                    transformed_img = transformed_img.rotate(rotation_degrees)

                    file_counter += 1
                    output_filename = f"aug_{file_counter}_{filename}"
                    output_path = os.path.join(output_folder, output_filename)
                    transformed_img.save(output_path)

def main():
    input_folders = ['C:/Users/Vlad Ursache/Desktop/augment']
    output_folders = ['C:/Users/Vlad Ursache/Desktop/augmented']

    for input_folder, output_folder in zip(input_folders, output_folders):
        print(f"Augmenting images in {input_folder} and saving to {output_folder}")
        augment_images(input_folder, output_folder)
        print(f"Augmented images from {input_folder} are saved in: {output_folder}")

if __name__ == "__main__":
    main()
