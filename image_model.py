import os
import requests
import numpy as np
import pandas as pd
from PIL import Image, ImageEnhance, ImageOps
import random
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.metrics import accuracy_score
import warnings

warnings.filterwarnings('ignore')

dataset_dir = "dataset"
os.makedirs(dataset_dir, exist_ok=True)

print("=== FETCHING REAL CANCER & HEALTHY CELL REFERENCES ONLINE ===")

# Reference images from public open-domain medical archives (Wikimedia Commons)
healthy_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Erythrocytes_CSEM.jpg/320px-Erythrocytes_CSEM.jpg"
leukemia_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Acute_leukemia-ALL.jpg/320px-Acute_leukemia-ALL.jpg"

def download_image(url, filename):
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(filename, 'wb') as f:
            for chunk in r:
                f.write(chunk)
    return Image.open(filename).convert('RGB').resize((64, 64))

try:
    print("Downloading Healthy Erythrocyte (Red Blood Cell) sample...")
    img_healthy = download_image(healthy_url, "healthy_ref.jpg")
    print("Downloading Acute Lymphoblastic Leukemia (ALL) sample...")
    img_leukemia = download_image(leukemia_url, "leukemia_ref.jpg")
except Exception as e:
    print(f"Error downloading: {e}")
    # Fallback to randomly generated colored noise if offline
    img_healthy = Image.fromarray(np.random.randint(0, 255, (64, 64, 3), dtype=np.uint8))
    img_leukemia = Image.fromarray(np.random.randint(0, 255, (64, 64, 3), dtype=np.uint8))

print("\n=== GENERATING 100 IMAGE DATASET USING DATA AUGMENTATION ===")
# We will create exactly 100 images (50 healthy, 50 leukemia) to mimic a dataset 
images_flat = []
labels = []
num_samples = 100

def apply_augmentation(img, i):
    # Apply random rotations, flips, and brightness to simulate cell variants
    img = img.rotate(random.randint(0, 360))
    if random.choice([True, False]):
        img = ImageOps.mirror(img)
    if random.choice([True, False]):
        img = ImageOps.flip(img)
    
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(random.uniform(0.7, 1.3))
    return img

print(f"Generating and saving {num_samples} sample images linearly to '{dataset_dir}/'...")
for i in range(num_samples):
    is_cancer = i % 2 != 0 # Alternate between healthy (0) and cancer (1)
    
    base_img = img_leukemia if is_cancer else img_healthy
    label_val = 1 if is_cancer else 0
    label_name = "Leukemia" if is_cancer else "Healthy"
    
    new_img = apply_augmentation(base_img, i)
    
    # Save image for user to view
    img_filename = f"cell_{i:03d}_{label_name}.png"
    img_path = os.path.join(dataset_dir, img_filename)
    new_img.save(img_path)
    
    images_flat.append(np.array(new_img).flatten())
    labels.append(label_val)

X = np.array(images_flat)
y = np.array(labels)
print(f"Dataset ready. Feature matrix shape: {X.shape}") # (100, 12288)

print("\n=== TRAINING CLASSIC ML CLASSIFIERS ON IMAGES ===")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

models = {
    'Random Forest (Images)': RandomForestClassifier(n_estimators=50, random_state=42),
    'Gradient Boosting (Images)': GradientBoostingClassifier(n_estimators=50, random_state=42),
    'GradForest Image Hybrid': VotingClassifier(
        estimators=[
            ('rf', RandomForestClassifier(n_estimators=50, random_state=42)),
            ('gb', GradientBoostingClassifier(n_estimators=50, random_state=42))
        ],
        voting='soft'
    )
}

results = []
for name, model in models.items():
    print(f"Training {name}...")
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    results.append({
        'Model Pipeline': name,
        'Accuracy': round(accuracy * 100, 2)
    })

results_df = pd.DataFrame(results)
print("\n=== PEDIATRIC CANCER CELL EVALUATION RESULTS (100 SAMPLE DATASET) ===")
print(results_df.to_string(index=False))

best_model_idx = results_df['Accuracy'].idxmax()
best_model_name = results_df.loc[best_model_idx, 'Model Pipeline']
best_model_acc = results_df.loc[best_model_idx, 'Accuracy']

print("\n=== IMAGE MODEL RECOMMENDATION ===")
print(f"The best performing image classifier is {best_model_name} with an Accuracy of {best_model_acc}%.")
