from xgboost import XGBClassifier

def build_model():
    return XGBClassifier(
        n_estimators=300,
        max_depth=8,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric='mlogloss',
        scale_pos_weight=2   
    )
