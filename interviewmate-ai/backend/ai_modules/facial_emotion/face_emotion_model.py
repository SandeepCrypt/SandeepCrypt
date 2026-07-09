# ============================================
# INTERVIEWMATE AI - FACE EMOTION MODEL
# ============================================

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
import os

class FaceEmotionModel:
    def __init__(self, model_path=None):
        self.model = None
        self.model_path = model_path or 'trained_models/emotion_model.h5'
        self.input_shape = (48, 48, 1)
        self.num_classes = 7
        self._build_or_load()
    
    def _build_model(self):
        model = Sequential([
            Conv2D(32, (3, 3), activation='relu', input_shape=self.input_shape),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Dropout(0.25),
            
            Conv2D(64, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Dropout(0.25),
            
            Conv2D(128, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D((2, 2)),
            Dropout(0.25),
            
            Flatten(),
            Dense(256, activation='relu'),
            BatchNormalization(),
            Dropout(0.5),
            Dense(self.num_classes, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def _build_or_load(self):
        if os.path.exists(self.model_path):
            try:
                self.model = tf.keras.models.load_model(self.model_path)
                print(f"Loaded face emotion model from {self.model_path}")
            except Exception as e:
                print(f"Failed to load model: {e}. Building new model.")
                self.model = self._build_model()
        else:
            print(f"Model not found at {self.model_path}. Building new model.")
            self.model = self._build_model()
    
    def predict(self, preprocessed_face):
        if self.model is None:
            raise RuntimeError("Model not loaded")
        return self.model.predict(preprocessed_face, verbose=0)
    
    def save(self, path=None):
        save_path = path or self.model_path
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        self.model.save(save_path)
        print(f"Model saved to {save_path}")
    
    def summary(self):
        return self.model.summary()