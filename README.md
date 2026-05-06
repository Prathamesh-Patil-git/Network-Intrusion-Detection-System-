# 🛡️ AI-Powered Network Intrusion Detection System (NIDS)

> **ML Mini Project — SY IoT Semester 4**
>
> A real-time Network Intrusion Detection System that uses XGBoost machine learning to classify network traffic as normal or malicious, and performs automated risk assessment.

---

## 📸 Overview

This project implements an intelligent NIDS that analyzes network traffic features from the **KDD Cup 1999** dataset to detect and classify cyber attacks into 5 categories (Normal, DoS, Probe, R2L, U2R), with an automated **risk scoring engine** that assigns threat levels (Low → Critical).

---

## 🏗️ Project Architecture

```
Mini_Project/
├── server.py                  # Flask API server (entry point)
├── requirements.txt           # Python dependencies
├── README.md                  # Project documentation
│
├── backend/                   # ML & business logic
│   ├── __init__.py
│   ├── preprocessing.py       # Data loading, encoding, feature engineering
│   ├── model.py               # XGBoost model configuration
│   ├── predict.py             # Prediction engine + risk assessment
│   └── train.py               # Model training pipeline
│
├── frontend/                  # Web-based UI
│   ├── index.html             # Single-page application
│   ├── css/
│   │   ├── style.css          # Core design system & tokens
│   │   ├── components.css     # Component-specific styles
│   │   └── animations.css     # Micro-animations & transitions
│   └── js/
│       ├── api.js             # API communication layer
│       ├── charts.js          # Chart.js visualizations
│       └── app.js             # Application logic & DOM management
│
├── data/                      # Datasets
│   ├── KDD_clean.csv          # Cleaned KDD training dataset
│   └── KDDTest+.csv           # KDD test dataset
│
└── models/                    # Trained model artifacts
    ├── nids_xgboost_model.pkl # Serialized XGBoost classifier
    ├── target_encoder.pkl     # Label encoder for attack classes
    ├── y_test.pkl             # Test set ground truth
    └── y_pred.pkl             # Test set predictions
```

---

## 🔬 ML Models & Concepts Used

### Core Algorithm: XGBoost (Extreme Gradient Boosting)

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `n_estimators` | 300 | Number of boosting rounds (trees) |
| `max_depth` | 8 | Maximum tree depth to control complexity |
| `learning_rate` | 0.1 | Step size shrinkage for regularization |
| `subsample` | 0.8 | Row sampling ratio per tree |
| `colsample_bytree` | 0.8 | Feature sampling ratio per tree |
| `eval_metric` | mlogloss | Multi-class log loss optimization |
| `scale_pos_weight` | 2 | Handles class imbalance |

### ML Concepts Applied

- **Supervised Multi-class Classification** — Classifying network traffic into 5 attack categories
- **Gradient Boosting** — Sequential ensemble of decision trees that corrects errors from previous trees
- **Label Encoding** — Converting categorical features (protocol_type, service, flag) into numerical representations
- **Stratified Train-Test Split** — 80/20 split maintaining class distribution proportions
- **Feature Engineering** — 41 network traffic features from the KDD dataset including:
  - Connection-level features (duration, bytes, flags)
  - Content-based features (failed logins, root access attempts)
  - Traffic-based features (connection counts, error rates)
  - Host-based features (destination host statistics)
- **Confusion Matrix Analysis** — Visual evaluation of per-class prediction performance
- **Risk Scoring Engine** — Rule-based risk mapping from attack type to threat severity

### Attack Classification Categories

| Category | Risk Level | Description | Example Attacks |
|----------|-----------|-------------|-----------------|
| **Normal** | 🟢 Low | Legitimate network traffic | — |
| **Probe** | 🟠 Medium | Surveillance/scanning attacks | satan, ipsweep, nmap, portsweep |
| **DoS** | 🔴 High | Denial of Service attacks | neptune, smurf, back, pod, teardrop |
| **R2L** | 🔴 High | Remote-to-Local unauthorized access | guess_passwd, ftp_write, imap, phf |
| **U2R** | 🔥 Critical | User-to-Root privilege escalation | buffer_overflow, rootkit, perl |

---

## ⚙️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Python 3.x** | Core programming language |
| **Flask** | Lightweight web framework for REST API |
| **Flask-CORS** | Cross-Origin Resource Sharing support |
| **XGBoost** | Gradient boosting ML classifier |
| **scikit-learn** | Preprocessing, encoding, metrics |
| **Pandas** | Data manipulation and analysis |
| **NumPy** | Numerical computing |
| **Joblib/Pickle** | Model serialization |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic page structure |
| **CSS3** | Custom design system with CSS variables |
| **Vanilla JavaScript** | Application logic (no frameworks) |
| **Chart.js** | Interactive doughnut & bar charts |
| **Google Fonts (Inter, JetBrains Mono)** | Typography |

### Dataset
| Detail | Value |
|--------|-------|
| **Source** | KDD Cup 1999 (NSL-KDD variant) |
| **Total Samples** | ~125,000+ |
| **Features** | 41 network traffic features |
| **Attack Classes** | 5 (Normal, DoS, Probe, R2L, U2R) |

---

## 🚀 How to Run

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start the Server

```bash
python server.py
```

### 3. Open the App

Navigate to **http://127.0.0.1:5000** in your browser.

### 4. (Optional) Retrain the Model

```bash
cd backend
python train.py
```

---

## 📊 Features

### 1. Threat Dashboard
- Real-time statistics (total samples, accuracy, attack classes, features)
- Interactive doughnut chart for attack type distribution
- Bar chart for risk level overview
- Quick action buttons for navigation

### 2. Single Sample Analyzer
- Select or randomize network traffic samples
- View predicted vs actual attack classification
- Visual threat level gauge (Low → Critical)
- Top feature values for the selected sample

### 3. Batch Threat Scanner
- Scan 5–100 samples simultaneously
- Risk level summary cards with counts
- Sortable results table with status indicators
- Color-coded risk badges

### 4. Model Performance Metrics
- Animated accuracy ring with percentage display
- Per-class precision, recall, F1-score breakdown
- Interactive confusion matrix heatmap
- Model specification tags

---

## 🌍 Real-World Applications

1. **Enterprise Network Security** — Monitor corporate networks for intrusion attempts in real-time
2. **ISP Traffic Monitoring** — Internet Service Providers can detect DDoS attacks and malicious traffic
3. **IoT Network Protection** — Secure IoT device networks from unauthorized access and attacks
4. **Cloud Infrastructure Security** — Detect anomalous patterns in cloud-hosted services
5. **SIEM Integration** — Feed predictions into Security Information and Event Management systems
6. **Cybersecurity Research** — Benchmark and evaluate new detection algorithms
7. **Military & Government Networks** — Classify and prioritize threats by severity for rapid response
8. **Financial Institutions** — Protect banking and trading networks from targeted cyber attacks

---

## 👥 Team

> SY IoT — Semester 4 ML Mini Project

---

## 📄 License

This project is developed for academic purposes as part of the SY IoT Sem 4 ML curriculum.
