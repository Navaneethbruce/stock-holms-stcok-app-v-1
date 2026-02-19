import os
import sys
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

import sys
import json
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model

# Load model once
model = load_model("ml/lstm_model.keras", compile=False)
model.compile(optimizer="adam", loss="mse")

# Read inputs
prices = np.array(json.loads(sys.argv[1])).reshape(-1, 1)

# Scale
scaler = MinMaxScaler()
scaled = scaler.fit_transform(prices)

window = 30

# Prepare last sequence (1, window, 1)
seq = scaled[-window:].reshape(1, window, 1)

# SINGLE prediction (no loop)
pred = model.predict(seq, verbose=0)

# Inverse scale
pred_price = scaler.inverse_transform(pred)[0][0]

# PRINT OUTPUT (IMPORTANT)
print(json.dumps([float(pred_price)]))
sys.exit(0)