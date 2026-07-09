# ============================================
# INTERVIEWMATE AI - NLP UTILITIES
# ============================================

import re
import nltk
from collections import Counter

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger')

class NLPUtils:
    @staticmethod
    def tokenize(text):
        return nltk.word_tokenize(text)
    
    @staticmethod
    def get_stopwords():
        return set(nltk.corpus.stopwords.words('english'))
    
    @staticmethod
    def extract_keywords(text, top_n=10):
        words = nltk.word_tokenize(text.lower())
        stopwords = set(nltk.corpus.stopwords.words('english'))
        words = [w for w in words if w.isalnum() and w not in stopwords and len(w) > 2]
        return Counter(words).most_common(top_n)
    
    @staticmethod
    def count_sentences(text):
        return len(nltk.sent_tokenize(text))
    
    @staticmethod
    def count_words(text):
        return len(text.split())
    
    @staticmethod
    def clean_text(text):
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    @staticmethod
    def extract_pos_tags(text):
        tokens = nltk.word_tokenize(text)
        return nltk.pos_tag(tokens)