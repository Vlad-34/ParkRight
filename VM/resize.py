from PIL import Image
import os

def resize_image(input_path, output_path, target_size):
    """
    Resize an image to fit within the specified dimensions, maintaining aspect ratio.
    
    :param input_path: Path to the input image.
    :param output_path: Path to save the resized image.
    :param target_size: Tuple of (width, height) for the target size.
    """
    try:
        with Image.open(input_path) as img:
            img.thumbnail(target_size)
            img.save(output_path)
            print(f"Resized image saved to {output_path}")
    except Exception as e:
        print(f"Error resizing image {input_path}: {e}")

def resize_images_in_folder(source_folder, target_folder, target_size):
    """
    Resize all JPEG images in a source folder and save them to a target folder.
    
    :param source_folder: Path to the source folder containing images.
    :param target_folder: Path to the target folder where resized images will be saved.
    :param target_size: Tuple of (width, height) for the target size.
    """
    os.makedirs(target_folder, exist_ok=True)
    for filename in os.listdir(source_folder):
        if filename.lower().endswith((".jpg", ".jpeg")):
            full_input_path = os.path.join(source_folder, filename)
            full_output_path = os.path.join(target_folder, filename)
            resize_image(full_input_path, full_output_path, target_size)

def main():
    source_folders = ['C:/Users/Vlad Ursache/Desktop/resize']
    target_folders = ['C:/Users/Vlad Ursache/Desktop/resized']
    target_size = (800, 600)

    for source_folder, target_folder in zip(source_folders, target_folders):
        print(f"Resizing images in {source_folder} and saving to {target_folder}")
        resize_images_in_folder(source_folder, target_folder, target_size)

    print("All JPG files in all source folders have been resized and saved to their respective target folders.")

if __name__ == "__main__":
    main()
