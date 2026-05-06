from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import os
import random

from backend.preprocessing import load_dataset, map_attack, encode_features
from backend.predict import predict_with_risk
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------
# LOAD DATA + MODEL ON STARTUP
# ---------------------------------------------------------------
print("Loading dataset...")
df = load_dataset()
df = map_attack(df)
df, encoders = encode_features(df)

X = df.drop(['attack', 'difficulty'], axis=1)
y_raw = df['attack']

target_encoder = LabelEncoder()
y = target_encoder.fit_transform(y_raw)

# Pre-load saved test predictions for metrics
y_test_saved = pickle.load(open(os.path.join(BASE_DIR, "models", "y_test.pkl"), "rb"))
y_pred_saved = pickle.load(open(os.path.join(BASE_DIR, "models", "y_pred.pkl"), "rb"))

print(f"Dataset loaded: {len(X)} samples, {len(target_encoder.classes_)} classes")


# ---------------------------------------------------------------
# SERVE FRONTEND
# ---------------------------------------------------------------
@app.route('/')
def index():
    return send_from_directory('frontend', 'index.html')


# ---------------------------------------------------------------
# API: Dataset Info
# ---------------------------------------------------------------
@app.route('/api/info')
def dataset_info():
    attack_counts = y_raw.value_counts().to_dict()
    return jsonify({
        "total_samples": len(X),
        "num_features": X.shape[1],
        "num_classes": len(target_encoder.classes_),
        "classes": list(target_encoder.classes_),
        "attack_distribution": attack_counts
    })


# ---------------------------------------------------------------
# API: Single Prediction
# ---------------------------------------------------------------
@app.route('/api/predict/single', methods=['POST'])
def predict_single():
    data = request.json
    idx = data.get('index', 0)

    if idx < 0 or idx >= len(X):
        return jsonify({"error": "Index out of range"}), 400

    sample = X.iloc[idx].values
    attack, risk = predict_with_risk(sample)
    actual = target_encoder.inverse_transform([y[idx]])[0]

    # Get top features for this sample
    feature_names = list(X.columns)
    feature_values = list(map(float, sample[:10]))
    top_features = [{"name": feature_names[i], "value": feature_values[i]} for i in range(10)]

    return jsonify({
        "index": idx,
        "predicted_attack": attack,
        "actual_attack": actual,
        "risk_level": risk,
        "correct": attack == actual,
        "top_features": top_features
    })


# ---------------------------------------------------------------
# API: Random Sample Prediction
# ---------------------------------------------------------------
@app.route('/api/predict/random')
def predict_random():
    idx = random.randint(0, len(X) - 1)
    sample = X.iloc[idx].values
    attack, risk = predict_with_risk(sample)
    actual = target_encoder.inverse_transform([y[idx]])[0]

    feature_names = list(X.columns)
    feature_values = list(map(float, sample[:10]))
    top_features = [{"name": feature_names[i], "value": feature_values[i]} for i in range(10)]

    return jsonify({
        "index": idx,
        "predicted_attack": attack,
        "actual_attack": actual,
        "risk_level": risk,
        "correct": attack == actual,
        "top_features": top_features
    })


# ---------------------------------------------------------------
# API: Batch Prediction
# ---------------------------------------------------------------
@app.route('/api/predict/batch', methods=['POST'])
def predict_batch():
    data = request.json
    n = min(data.get('count', 10), 100)
    start = data.get('start', 0)

    results = []
    for i in range(start, min(start + n, len(X))):
        sample = X.iloc[i].values
        attack, risk = predict_with_risk(sample)
        actual = target_encoder.inverse_transform([y[i]])[0]

        results.append({
            "index": i,
            "predicted_attack": attack,
            "actual_attack": actual,
            "risk_level": risk,
            "correct": attack == actual,
        })

    return jsonify({
        "results": results,
        "total": len(results)
    })


# ---------------------------------------------------------------
# API: Model Metrics
# ---------------------------------------------------------------
@app.route('/api/metrics')
def model_metrics():
    from backend.predict import target_encoder as te

    acc = accuracy_score(y_test_saved, y_pred_saved)
    report = classification_report(
        y_test_saved, y_pred_saved,
        target_names=te.classes_,
        zero_division=0,
        output_dict=True
    )

    cm = confusion_matrix(y_test_saved, y_pred_saved).tolist()

    # Per-class metrics
    per_class = []
    for cls in te.classes_:
        if cls in report:
            per_class.append({
                "class": cls,
                "precision": round(report[cls]["precision"], 4),
                "recall": round(report[cls]["recall"], 4),
                "f1": round(report[cls]["f1-score"], 4),
                "support": int(report[cls]["support"])
            })

    return jsonify({
        "accuracy": round(acc, 4),
        "per_class": per_class,
        "confusion_matrix": cm,
        "class_names": list(te.classes_),
        "total_test_samples": len(y_test_saved)
    })


# ---------------------------------------------------------------
# API: Attack Distribution for Charts
# ---------------------------------------------------------------
@app.route('/api/distribution')
def distribution():
    risk_map = {'Normal': 'Low', 'Probe': 'Medium', 'DoS': 'High', 'R2L': 'High', 'U2R': 'Critical'}
    attack_counts = y_raw.value_counts().to_dict()
    risk_counts = {}
    for atk, cnt in attack_counts.items():
        risk = risk_map.get(atk, 'Unknown')
        risk_counts[risk] = risk_counts.get(risk, 0) + cnt

    return jsonify({
        "attack_distribution": attack_counts,
        "risk_distribution": risk_counts
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
