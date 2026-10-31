# Python runtime for Wagtail LMS Backend
FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    DJANGO_SETTINGS_MODULE=synapse_backend.settings.production

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Install python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application source
COPY . .

# Collect static files for production
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Automated migration, seeding, and production gunicorn server startup
CMD set -xe; \
    python manage.py migrate --noinput; \
    python manage.py seed_lms_demo; \
    gunicorn synapse_backend.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
