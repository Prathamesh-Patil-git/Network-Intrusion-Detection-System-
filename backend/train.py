import os
import sys
import joblib
import pickle

from sklearn.metrics import accuracy_score, classification_report
from collections import Counter

# Ensure parent directory is in path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from preprocessing import load_dataset, map_attack, encode_features, prepare_data
from model import build_model

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ---- Load & Prepare ----
df = load_dataset()
df = map_attack(df)
df, encoders = encode_features(df)

X_train, X_test, y_train, y_test, target_encoder = prepare_data(df)

print("\nTrain Distribution:", Counter(y_train))

# ---- Build & Train ----
model = build_model()
model.fit(X_train, y_train)

# ---- Evaluate ----
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("\nModel Accuracy:", accuracy)

print("\nClassification Report:\n")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=target_encoder.classes_,
        zero_division=0
    )
)

# ---- Save Artifacts ----
os.makedirs(MODELS_DIR, exist_ok=True)

joblib.dump(model, os.path.join(MODELS_DIR, "nids_xgboost_model.pkl"))
joblib.dump(target_encoder, os.path.join(MODELS_DIR, "target_encoder.pkl"))

pickle.dump(y_test, open(os.path.join(MODELS_DIR, "y_test.pkl"), "wb"))
pickle.dump(y_pred, open(os.path.join(MODELS_DIR, "y_pred.pkl"), "wb"))

print("\n✅ Model Saved Successfully to models/ directory")