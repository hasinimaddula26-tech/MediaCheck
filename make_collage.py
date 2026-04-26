from PIL import Image
import os

images_dir = r"C:\Users\M.Hasini\OneDrive\Desktop\Soln AI\Child_Health_Dashboard\images"
img_names = ["hero.png", "awareness.png", "gallery1.png", "gallery2.png"]
imgs = []

for name in img_names:
    p = os.path.join(images_dir, name)
    if os.path.exists(p):
        # Convert to RGB to avoid alpha channel issues when pasting
        imgs.append(Image.open(p).convert('RGB'))

if imgs:
    # Resize all to identical size for a neat grid
    width, height = 800, 600
    resized_imgs = [img.resize((width, height)) for img in imgs]
    
    # Create a 2x2 collage grid
    collage = Image.new('RGB', (width * 2, height * 2), color='white')
    
    collage.paste(resized_imgs[0], (0, 0))
    if len(resized_imgs) > 1: collage.paste(resized_imgs[1], (width, 0))
    if len(resized_imgs) > 2: collage.paste(resized_imgs[2], (0, height))
    if len(resized_imgs) > 3: collage.paste(resized_imgs[3], (width, height))
    
    out_path = r"C:\Users\M.Hasini\OneDrive\Desktop\Soln AI\Child_Health_Dashboard\images\collage.png"
    collage.save(out_path)
    print("Collage created successfully!")
else:
    print("No images found.")
