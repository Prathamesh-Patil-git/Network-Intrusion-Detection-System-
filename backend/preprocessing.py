import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

# Use relative path from project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

columns = [
    'duration','protocol_type','service','flag','src_bytes','dst_bytes','land',
    'wrong_fragment','urgent','hot','num_failed_logins','logged_in','num_compromised',
    'root_shell','su_attempted','num_root','num_file_creations','num_shells',
    'num_access_files','num_outbound_cmds','is_host_login','is_guest_login',
    'count','srv_count','serror_rate','srv_serror_rate','rerror_rate','srv_rerror_rate',
    'same_srv_rate','diff_srv_rate','srv_diff_host_rate','dst_host_count',
    'dst_host_srv_count','dst_host_same_srv_rate','dst_host_diff_srv_rate',
    'dst_host_same_src_port_rate','dst_host_srv_diff_host_rate','dst_host_serror_rate',
    'dst_host_srv_serror_rate','dst_host_rerror_rate','dst_host_srv_rerror_rate',
    'attack','difficulty'
]

attack_map = {
    'neptune':'DoS','smurf':'DoS','back':'DoS','pod':'DoS','teardrop':'DoS','land':'DoS',
    'satan':'Probe','ipsweep':'Probe','nmap':'Probe','portsweep':'Probe',
    'guess_passwd':'R2L','ftp_write':'R2L','imap':'R2L','phf':'R2L',
    'multihop':'R2L','warezmaster':'R2L','warezclient':'R2L',
    'buffer_overflow':'U2R','rootkit':'U2R','perl':'U2R','loadmodule':'U2R',
    'normal':'Normal'
}

def load_dataset():
    csv_path = os.path.join(BASE_DIR, "data", "KDD_clean.csv")
    df = pd.read_csv(csv_path, header=None, low_memory=False)
    df.columns = columns
    return df


def map_attack(df):
    df['attack'] = df['attack'].astype(str).str.strip().str.lower()
    df['attack'] = df['attack'].apply(lambda x: attack_map.get(x, x))
    df = df[df['attack'] != 'attack_type']
    return df


def encode_features(df):
    categorical = ['protocol_type', 'service', 'flag']
    encoders = {}

    for col in categorical:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le

    for col in df.columns:
        if df[col].dtype == 'object' and col != 'attack':
            df[col] = pd.to_numeric(df[col], errors='coerce')

    df.fillna(0, inplace=True)

    return df, encoders


def prepare_data(df):
    counts = df['attack'].value_counts()
    valid_classes = counts[counts >= 5].index
    df = df[df['attack'].isin(valid_classes)]

    X = df.drop(['attack','difficulty'], axis=1)
    y = df['attack']

    target_encoder = LabelEncoder()
    y = target_encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    return X_train, X_test, y_train, y_test, target_encoder
