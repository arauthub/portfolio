# Multi-stage Dockerfile for Atelier Vogue Wagtail Backend
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    libwebp-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Final runtime image
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    libjpeg62-turbo \
    libwebp7 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=atelier_backend.settings.production

COPY . .

# Run collectstatic for production whitenoise
RUN python manage.py collectstatic --noinput || true

EXPOSE 8080

CMD ["gunicorn", "atelier_backend.wsgi:application", "--bind", "0.0.0.0:8080", "--workers", "3", "--timeout", "120"]
