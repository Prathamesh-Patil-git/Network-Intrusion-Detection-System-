import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "models", "nids_xgboost_model.pkl"))
target_encoder = joblib.load(os.path.join(BASE_DIR, "models", "target_encoder.pkl"))

risk_map = {
    'Normal': 'Low',
    'Probe': 'Medium',
    'DoS': 'High',
    'R2L': 'High',
    'U2R': 'Critical'
}


def predict_with_risk(sample):
    """
    Input: 1 sample (list or array of 41 features)
    Output: attack type + risk level
    """
    sample = np.array(sample).reshape(1, -1)
    prediction = model.predict(sample)
    attack = target_encoder.inverse_transform(prediction)[0]
    risk = risk_map.get(attack, "Unknown")
    return attack, risk


def predict_attack(sample):
    attack, _ = predict_with_risk(sample)
    return attack


def batch_predict_with_risk(X):
    """
    Input: multiple samples (DataFrame or 2D array)
    Output: list of dicts (attack + risk)
    """
    results = []
    for i in range(len(X)):
        sample = X[i] if not hasattr(X, "iloc") else X.iloc[i].values
        attack, risk = predict_with_risk(sample)
        results.append({
            "Attack": attack,
            "Risk": risk
        })
    return results
