import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score
import warnings

warnings.filterwarnings('ignore')

# 1. Generate Synthetic Dataset based on the 10 pediatric symptoms
# Setting random seed for reproducibility
np.random.seed(42)
num_samples = 2000

# 10 attributes
# Generating random 0/1 for symptoms. 
# We'll make cancer positive (1) more likely if certain heavy-weight symptoms are present.
fatigue = np.random.choice([0, 1], size=num_samples, p=[0.4, 0.6])
fever = np.random.choice([0, 1], size=num_samples, p=[0.5, 0.5])
weightLoss = np.random.choice([0, 1], size=num_samples, p=[0.8, 0.2])
appetite = np.random.choice([0, 1], size=num_samples, p=[0.6, 0.4])
bonePain = np.random.choice([0, 1], size=num_samples, p=[0.7, 0.3])
lymph = np.random.choice([0, 1], size=num_samples, p=[0.6, 0.4])
abdominal = np.random.choice([0, 1], size=num_samples, p=[0.7, 0.3])
pale = np.random.choice([0, 1], size=num_samples, p=[0.6, 0.4])
bruising = np.random.choice([0, 1], size=num_samples, p=[0.8, 0.2])
lump = np.random.choice([0, 1], size=num_samples, p=[0.85, 0.15])

# Calculate a hidden 'risk score' to assign the target variable realistically
risk_scores = (fatigue * 1 + fever * 1 + weightLoss * 2.5 + appetite * 1.5 + 
               bonePain * 2.5 + lymph * 1.5 + abdominal * 2 + pale * 1.5 + 
               bruising * 2.5 + lump * 3)

# Add some noise
risk_scores = risk_scores + np.random.normal(0, 2, num_samples)

# Threshold for cancer (approx top 10% of risk scores to simulate rarity, but we'll balance it a bit for ML purpose)
threshold = np.percentile(risk_scores, 75) 
target = (risk_scores > threshold).astype(int)

# Create DataFrame
df = pd.DataFrame({
    'Persistent_Fatigue': fatigue,
    'Prolonged_Fever': fever,
    'Weight_Loss': weightLoss,
    'Loss_of_Appetite': appetite,
    'Bone_Joint_Pain': bonePain,
    'Swollen_Lymph_Nodes': lymph,
    'Abdominal_Swelling': abdominal,
    'Pale_Skin': pale,
    'Easy_Bruising': bruising,
    'Visible_Lump': lump,
    'Pediatric_Cancer': target
})

# 2. Prepare Data
X = df.drop('Pediatric_Cancer', axis=1)
y = df['Pediatric_Cancer']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Define the ML Models
models = {
    'Logistic Regression': LogisticRegression(),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Support Vector Machine (SVM)': SVC(kernel='linear', random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(random_state=42),
    'K-Nearest Neighbors (KNN)': KNeighborsClassifier(n_neighbors=5),
    'GradForest Hybrid Model': VotingClassifier(
        estimators=[
            ('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
            ('gb', GradientBoostingClassifier(random_state=42))
        ],
        voting='soft'
    )
}

# 4. Train, Predict, and Evaluate
results = []
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    
    results.append({
        'Model': name,
        'Accuracy': round(accuracy * 100, 2),
        'Precision': round(precision * 100, 2),
        'Recall': round(recall * 100, 2)
    })

# Convert to DataFrame to display results cleanly
results_df = pd.DataFrame(results)
print("=== PEDIATRIC CANCER ML PREDICTION RESULTS ===")
print(results_df.to_string(index=False))

# Identify best model based on combination of Accuracy and Precision
best_model_idx = results_df['Accuracy'].idxmax()
best_model_name = results_df.loc[best_model_idx, 'Model']
best_model_acc = results_df.loc[best_model_idx, 'Accuracy']
best_model_prec = results_df.loc[best_model_idx, 'Precision']

print("\n=== BEST MODEL RECOMMENDATION ===")
print(f"The best performing model is {best_model_name} with an Accuracy of {best_model_acc}% and Precision of {best_model_prec}%.")
