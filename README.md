# 🛡️ AI-Powered Network Intrusion Detection System (NIDS)

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

### 1. Create & Activate Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the Server

```bash
python server.py
```

### 4. Open the App

Navigate to **http://127.0.0.1:5000** in your browser.

### 5. (Optional) Retrain the Model

```bash
cd backend
python train.py
```

---

## 📊 UI Modules — How to Use Each Screen

### 1. 🖥️ Threat Dashboard (Home Tab)

**What it shows:** A bird's-eye overview of the entire dataset and model performance.

| UI Element | What It Means |
|-----------|--------------|
| **Total Samples** | Total number of network traffic records loaded from the KDD dataset (~125,000+) |
| **Model Accuracy** | Percentage of test samples the model predicted correctly |
| **Attack Classes** | Number of attack categories (5 — Normal, DoS, Probe, R2L, U2R) |
| **Features** | Number of input features per sample (41 network traffic attributes) |
| **Doughnut Chart** | Visual breakdown of how many samples belong to each attack type |
| **Bar Chart** | Count of samples grouped by risk level (Low / Medium / High / Critical) |

**How to use:** This page loads automatically on startup. Click the **Quick Action** buttons at the bottom to jump to other modules.

---

### 2. 🔍 Single Sample Analyzer

**What it does:** Picks **one specific network traffic record** from the dataset, feeds its 41 features into the XGBoost model, and shows the prediction result.

#### Understanding the "Sample Index" Input

The **Sample Index** is the **row number** of a network traffic record in the loaded KDD dataset (0-indexed).

```
Sample Index = Row number in the dataset (starting from 0)
```

| If you enter... | What happens |
|----------------|-------------|
| `0` | Analyzes the **1st** record in the dataset |
| `100` | Analyzes the **101st** record in the dataset |
| `12340` | Analyzes the **12,341st** record in the dataset |
| `50000` | Analyzes the **50,001st** record in the dataset |

> **Think of it like a spreadsheet:** If you open the KDD CSV file in Excel, Sample Index `12340` would be **row 12,341** (since indexing starts from 0). That row contains 41 feature values like `duration`, `protocol_type`, `src_bytes`, etc., representing one captured network connection.

#### What each result field means

| Output Field | Meaning |
|-------------|---------|
| **Predicted Attack** | What the ML model *thinks* this traffic is (e.g., `DoS`, `Normal`, `Probe`) |
| **Actual Attack** | What this traffic *actually* is (ground truth label from the dataset) |
| **Risk Level** | Threat severity derived from the predicted attack type (Low → Critical) |
| **Prediction ✓/✕** | Whether the model's prediction matches the actual label (correct or incorrect) |
| **Threat Gauge** | Visual bar that fills from left (Low) to right (Critical) based on risk level |
| **Top Features** | The first 10 feature values of this sample (e.g., `duration: 0`, `src_bytes: 491`, etc.) |

#### The 41 Features — What do the numbers represent?

Each sample (row) has 41 numeric values. These are attributes of a **single network connection** captured by a network sniffer:

| Feature Group | Example Features | What They Measure |
|--------------|-----------------|-------------------|
| **Connection** | `duration`, `src_bytes`, `dst_bytes` | How long the connection lasted, bytes sent/received |
| **Protocol** | `protocol_type`, `service`, `flag` | TCP/UDP/ICMP, which service (http, ftp, smtp), connection status flags |
| **Content** | `num_failed_logins`, `root_shell`, `su_attempted` | Suspicious activity indicators like failed login attempts |
| **Traffic** | `count`, `srv_count`, `serror_rate` | Connection frequency and error rates in last 2 seconds |
| **Host** | `dst_host_count`, `dst_host_srv_count` | Statistics about the destination host over last 100 connections |

#### Step-by-step usage

1. Enter a number between `0` and the total sample count (shown on Dashboard) in the **Sample Index** field
2. Click **Analyze** → model predicts that specific sample
3. **OR** click **Random** → system picks a random row and auto-fills the index
4. View the prediction result, risk gauge, and top feature values

---

### 3. 📋 Batch Threat Scanner

**What it does:** Scans **multiple consecutive samples** at once and shows a summary of how many are low/medium/high/critical risk.

#### Understanding the inputs

| Input Field | What It Means | Range |
|-----------|--------------|-------|
| **Number of Samples** (slider) | How many consecutive rows to scan at once | 5 to 100 |
| **Start Index** | Which row number to start scanning from (0-indexed) | 0 to total samples |

#### Example scenarios

| Start Index | Number of Samples | What It Scans |
|------------|------------------|--------------|
| `0` | `20` | Rows 0 through 19 (first 20 records) |
| `1000` | `50` | Rows 1000 through 1049 |
| `50000` | `100` | Rows 50000 through 50099 |

#### Output breakdown

| Output | What It Shows |
|--------|-------------|
| **Summary Cards** | 4 colored cards showing count of samples per risk level: 🟢 Low, 🟠 Medium, 🔴 High, 🔥 Critical |
| **Results Table** | Row-by-row breakdown with columns: Index, Predicted Attack, Actual Attack, Risk Level, Status (✓ Match / ✕ Mismatch) |
| **Risk Badges** | Color-coded labels — green (Low), amber (Medium), red (High), dark red (Critical) |
| **Status** | ✓ Match = model predicted correctly, ✕ Mismatch = model got it wrong |

#### Step-by-step usage

1. Drag the **slider** to choose how many samples to scan (5–100)
2. Enter a **Start Index** (which row to begin from)
3. Click **Run Batch Scan**
4. View the summary cards for a quick risk overview
5. Scroll down to the table for individual sample results

---

### 4. 📈 Model Performance Metrics

**What it does:** Shows how well the XGBoost model performs on the test dataset (20% of data held out during training).

| UI Element | What It Shows |
|-----------|-------------|
| **Accuracy Ring** | Overall accuracy as an animated circular progress bar (e.g., 99.24%) |
| **Test Samples** | How many samples were used in the test set |
| **Model Specs** | Key hyperparameters: 300 Estimators, Max Depth 8, Learning Rate 0.1 |
| **Per-Class Table** | For each attack type — **Precision** (how many predictions of this class were correct), **Recall** (how many actual instances were detected), **F1-Score** (harmonic mean of both), **Support** (how many test samples of this class exist) |
| **Confusion Matrix** | Heatmap grid — rows = actual class, columns = predicted class. Diagonal (green) = correct predictions. Off-diagonal (red) = misclassifications |

**How to read the Confusion Matrix:**
- **Bright green on diagonal** → model predicts this class very well
- **Red off-diagonal** → model confuses one class for another
- Hover over any cell to see: `Actual: X, Predicted: Y: count`

---

### 💡 Quick Reference — What does a number like `12340` mean?

```
┌─────────────────────────────────────────────────────────────┐
│  KDD Dataset (CSV file loaded in memory)                    │
│                                                             │
│  Row 0     → 1st network connection  (Index = 0)           │
│  Row 1     → 2nd network connection  (Index = 1)           │
│  ...                                                        │
│  Row 12340 → 12,341st connection     (Index = 12340)       │
│  ...                                                        │
│  Row 125972→ Last connection         (Index = 125972)       │
│                                                             │
│  Each row has 41 features describing ONE network connection │
│  captured by a network monitoring tool (e.g., tcpdump)      │
└─────────────────────────────────────────────────────────────┘

When you type 12340 in the Analyzer:
  → The system reads row 12340 from the dataset
  → Extracts its 41 feature values
  → Feeds them into the trained XGBoost model
  → Model outputs: "This looks like a DoS attack" (for example)
  → Risk engine maps DoS → High risk
  → UI displays the result with visual indicators
```

---

## 🔧 How Each Module Works

### Backend Modules (`backend/`)

#### 1. `preprocessing.py` — Data Loading & Feature Engineering

This is the **data pipeline** module responsible for transforming raw CSV data into ML-ready features.

| Function | What It Does |
|----------|-------------|
| `load_dataset()` | Reads `data/KDD_clean.csv`, assigns 43 column names (41 features + `attack` + `difficulty`), and returns a Pandas DataFrame |
| `map_attack(df)` | Maps 23 specific attack names (e.g., `neptune`, `smurf`, `satan`) into 5 high-level categories using a lookup dictionary: **Normal, DoS, Probe, R2L, U2R** |
| `encode_features(df)` | Applies `LabelEncoder` to 3 categorical columns (`protocol_type`, `service`, `flag`) to convert text values into integers. Also coerces any remaining object columns to numeric and fills NaN values with 0 |
| `prepare_data(df)` | Filters classes with fewer than 5 samples, splits data into **80% train / 20% test** using stratified sampling to preserve class distribution, and returns `X_train, X_test, y_train, y_test, target_encoder` |

**Data Flow:**
```
KDD_clean.csv → load_dataset() → map_attack() → encode_features() → prepare_data()
                   ↓                  ↓                ↓                    ↓
              Raw DataFrame     5 categories     Numeric features     Train/Test split
```

---

#### 2. `model.py` — XGBoost Model Configuration

A single-function module that builds and returns a configured `XGBClassifier` instance.

```python
XGBClassifier(
    n_estimators=300,    # 300 boosting rounds (trees built sequentially)
    max_depth=8,         # Each tree can be up to 8 levels deep
    learning_rate=0.1,   # Shrinks each tree's contribution for regularization
    subsample=0.8,       # Each tree sees 80% of training rows (prevents overfitting)
    colsample_bytree=0.8,# Each tree sees 80% of features (adds diversity)
    eval_metric='mlogloss',   # Optimizes multi-class log loss
    scale_pos_weight=2        # Compensates for class imbalance
)
```

**Why these values?** The combination of `subsample` and `colsample_bytree` at 0.8 introduces randomness to prevent overfitting, while 300 estimators with depth 8 provides enough model complexity to capture intricate network traffic patterns.

---

#### 3. `train.py` — Model Training Pipeline

This script is the **one-time training runner** that produces the saved model artifacts.

**Step-by-step execution:**

1. **Load & prepare data** — Calls `load_dataset()` → `map_attack()` → `encode_features()` → `prepare_data()`
2. **Build model** — Calls `build_model()` from `model.py`
3. **Train** — Fits the XGBoost model on `X_train, y_train`
4. **Evaluate** — Predicts on `X_test`, prints accuracy and full classification report
5. **Save 4 artifacts** to `models/` directory:
   - `nids_xgboost_model.pkl` — The trained XGBoost classifier
   - `target_encoder.pkl` — The LabelEncoder mapping (0–4 ↔ attack names)
   - `y_test.pkl` — Ground truth labels for the test set
   - `y_pred.pkl` — Model predictions on the test set (used for metrics display)

**Run with:** `cd backend && python train.py`

---

#### 4. `predict.py` — Prediction Engine + Risk Assessment

This module loads the pre-trained model and provides inference functions.

| Function | Input | Output | How It Works |
|----------|-------|--------|-------------|
| `predict_with_risk(sample)` | 1D array of 41 features | `(attack_type, risk_level)` | Reshapes input to 2D → XGBoost `.predict()` → inverse-transforms label → maps to risk level via `risk_map` |
| `predict_attack(sample)` | 1D array of 41 features | `attack_type` string | Wrapper around `predict_with_risk`, returns only the attack label |
| `batch_predict_with_risk(X)` | 2D array / DataFrame | List of `{Attack, Risk}` dicts | Iterates through each row, calls `predict_with_risk` per sample |

**Risk Mapping Logic:**
```
Normal  → Low      (legitimate traffic)
Probe   → Medium   (scanning/reconnaissance)
DoS     → High     (denial of service)
R2L     → High     (remote access attacks)
U2R     → Critical (privilege escalation — most dangerous)
```

---

#### 5. `server.py` — Flask API Server (Entry Point)

The main application server that **wires together all backend modules** and **serves the frontend**.

**Startup Sequence:**
1. Loads the full KDD dataset using `preprocessing.py`
2. Encodes features and prepares the feature matrix `X` and label array `y`
3. Loads saved `y_test.pkl` and `y_pred.pkl` for metrics computation
4. Starts Flask on port 5000

**API Endpoints:**

| Endpoint | Method | Description | Used By |
|----------|--------|-------------|---------|
| `/` | GET | Serves `frontend/index.html` (SPA entry point) | Browser |
| `/api/info` | GET | Returns dataset stats: total samples, feature count, class count, attack distribution | Dashboard |
| `/api/predict/single` | POST | Predicts a single sample by index; returns predicted vs actual attack, risk level, top 10 feature values | Analyzer |
| `/api/predict/random` | GET | Picks a random sample index and predicts it | Analyzer |
| `/api/predict/batch` | POST | Predicts `count` samples starting from `start` index (max 100); returns results array | Batch Scanner |
| `/api/metrics` | GET | Computes accuracy, per-class precision/recall/F1, and confusion matrix from saved test predictions | Metrics Page |
| `/api/distribution` | GET | Returns attack type counts and aggregated risk level counts | Dashboard Charts |

---

### Frontend Modules (`frontend/`)

#### 6. `js/api.js` — API Communication Layer

Handles all HTTP communication between the browser and Flask server.

| Function | What It Does |
|----------|-------------|
| `apiGet(endpoint)` | Sends a `GET` request to the Flask API, parses JSON response. On error, triggers a toast notification |
| `apiPost(endpoint, body)` | Sends a `POST` request with JSON body, parses response. On error, triggers a toast notification |
| `showToast(message, type)` | Creates an animated notification popup (success ✓, error ✕, info ℹ) that auto-dismisses after 3.5 seconds |
| `showLoading()` / `hideLoading()` | Toggles a full-screen loading overlay with spinner during API calls |

---

#### 7. `js/app.js` — Main Application Logic & DOM Management

This is the **core UI controller** that manages navigation, data rendering, and user interactions.

**Module Breakdown:**

| Section | Functions | How It Works |
|---------|-----------|-------------|
| **Navigation** | `initNavigation()`, `switchSection()` | Listens to nav link clicks, toggles `.active` class on sections. Lazy-loads metrics data when the metrics tab is first opened |
| **Dashboard** | `loadDashboard()` | Fetches `/api/info` and `/api/distribution` in parallel using `Promise.all()`. Animates stat counters with eased cubic animation. Triggers chart creation |
| **Analyzer** | `predictSingle()`, `predictRandom()`, `displayResult()` | Sends sample index to `/api/predict/single` (or uses `/api/predict/random`). Renders prediction result, risk gauge fill animation, correctness badge, and top-10 feature values table |
| **Batch Scanner** | `runBatch()`, `displayBatchResults()` | Posts count + start index to `/api/predict/batch`. Renders summary cards (Low/Medium/High/Critical counts) and a sortable results table with color-coded risk badges and match/mismatch status |
| **Metrics** | `loadMetrics()`, `buildConfusionMatrix()` | Fetches `/api/metrics` once (cached with `metricsLoaded` flag). Animates an SVG accuracy ring using `strokeDashoffset`. Renders per-class precision/recall/F1 table with color-coded values. Builds an interactive confusion matrix heatmap with color intensity based on value magnitude |

**Animated Counter (`animateValue`):**
Uses `requestAnimationFrame` with cubic ease-out interpolation (`1 - (1-t)³`) to smoothly animate number counters from 0 to the target value over 800ms.

---

#### 8. `js/charts.js` — Chart.js Visualizations

Creates and manages two interactive charts on the Dashboard.

| Function | Chart Type | Data Source | Visual Details |
|----------|-----------|-------------|----------------|
| `createAttackChart(data)` | Doughnut | `/api/distribution` → `attack_distribution` | 65% cutout, color-coded by attack type (green=Normal, red=DoS, amber=Probe, purple=R2L, crimson=U2R), right-positioned legend with percentage tooltips |
| `createRiskChart(data)` | Bar | `/api/distribution` → `risk_distribution` | Ordered Low→Critical, semi-transparent fills with colored borders, rounded corners (8px radius), clean grid with no x-axis gridlines |

Both charts are responsive, destroy previous instances before re-creating (prevents memory leaks), and use a consistent dark tooltip theme.

---

#### 9. `index.html` — Single-Page Application (SPA)

The HTML file is structured as a **single-page app with 4 tab-based sections**:

| Section | Tab Name | Key UI Elements |
|---------|----------|-----------------|
| **Dashboard** | `dashboard` | 4 stat cards (Total Samples, Accuracy, Attack Classes, Features) + 2 charts (Doughnut + Bar) + Quick Action buttons |
| **Analyzer** | `analyzer` | Sample index input + Analyze/Random buttons → Result card with prediction, risk gauge, correctness badge, features table |
| **Batch Scan** | `batch` | Count slider (5–100) + Start index input → Summary cards (Low/Med/High/Critical) + Results table |
| **Metrics** | `metrics` | SVG accuracy ring + Per-class metrics table + Confusion matrix heatmap |

---

### CSS Design System (`frontend/css/`)

| File | Purpose |
|------|---------|
| `style.css` | Core design tokens (CSS variables for colors, fonts, spacing, shadows), base layout, navigation, and section containers |
| `components.css` | Reusable component styles — stat cards, result boxes, risk badges, gauge, tables, confusion matrix grid, toast notifications |
| `animations.css` | Micro-animations — fade-in, slide-up, pulse, gauge fill transitions, ring stroke animations, row entrance animations |

---

### 📦 End-to-End Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Browser)                       │
│                                                             │
│  Dashboard ←→ Analyzer ←→ Batch Scanner ←→ Model Metrics   │
│      ↕            ↕             ↕               ↕           │
│   charts.js    app.js        app.js          app.js         │
│      ↕            ↕             ↕               ↕           │
│                    api.js (GET / POST)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP (JSON)
                       ↓
┌──────────────────────┴──────────────────────────────────────┐
│                   server.py (Flask API)                      │
│                                                             │
│   /api/info          → preprocessing.py (dataset stats)     │
│   /api/predict/*     → predict.py (XGBoost inference)       │
│   /api/metrics       → sklearn metrics (from saved y_test)  │
│   /api/distribution  → aggregated attack/risk counts        │
│                                                             │
│   Startup: preprocessing.py loads CSV → encodes features    │
│            predict.py loads model + encoder from models/     │
└─────────────────────────────────────────────────────────────┘
```

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



---

## 📄 License

This project is developed for academic purposes as part of the SY IoT Sem 4 ML curriculum.
