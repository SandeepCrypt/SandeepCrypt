# ============================================
# INTERVIEWMATE AI - AI MODULE TESTS
# ============================================

import pytest
from ai_modules.facial_emotion.face_emotion_detector import FaceEmotionDetector
from ai_modules.speech_emotion.speech_emotion_detector import SpeechEmotionDetector

def test_face_emotion_detector():
    detector = FaceEmotionDetector()
    result = detector._default_result()
    assert 'emotion' in result
    assert 'confidence' in result

def test_speech_emotion_detector():
    detector = SpeechEmotionDetector()
    result = detector._default_result()
    assert 'emotion' in result
    assert 'confidence' in result