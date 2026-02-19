import json, numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

# Dummy historical data (replace later with real)
prices = np.array([200 + i for i in range(60)]).reshape(-1, 1)

scaler = MinMaxScaler()
scaled = scaler.fit_transform(prices)

X, y = [], []
window = 30
for i in range(window, len(scaled)):
    X.append(scaled[i-window:i,0])
    y.append(scaled[i,0])

X, y = np.array(X), np.array(y)
X = X.reshape(X.shape[0], X.shape[1], 1)

model = Sequential([
    LSTM(32, input_shape=(window,1)),
    Dense(1)
])

model.compile(optimizer="adam", loss="mse")
model.fit(X, y, epochs=20, batch_size=8)

model.save("ml/lstm_model.keras")
print("Model trained & saved")
