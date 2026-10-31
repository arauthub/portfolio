import os
from .base import *

DEBUG = os.environ.get("DJANGO_DEBUG", "False").lower() in ("true", "1", "yes")

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY", 
    "synapse-cyber-production-secret-key-super-secure-change-in-prod-2026"
)

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "*").split(",")

# CORS settings for production
CORS_ALLOW_ALL_ORIGINS = os.environ.get("CORS_ALLOW_ALL", "True").lower() in ("true", "1")

# CSRF trusted origins
csrf_origins = os.environ.get("CSRF_TRUSTED_ORIGINS", "")
if csrf_origins:
    CSRF_TRUSTED_ORIGINS = csrf_origins.split(",")

try:
    from .local import *
except ImportError:
    pass
