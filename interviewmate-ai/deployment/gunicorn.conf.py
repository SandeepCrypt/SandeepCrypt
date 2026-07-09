# ============================================
# INTERVIEWMATE AI - GUNICORN CONFIGURATION
# ============================================

import multiprocessing

bind = "0.0.0.0:5000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "eventlet"
worker_connections = 1000
timeout = 120
keepalive = 5

errorlog = "logs/gunicorn_error.log"
accesslog = "logs/gunicorn_access.log"
loglevel = "info"

preload_app = True
daemon = False

def on_starting(server):
    pass

def on_reload(server):
    pass