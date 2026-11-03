#!/usr/bin/env bash
set -e

export CLOUDSDK_PYTHON="/opt/homebrew/bin/python3.12"
export PATH="$HOME/google-cloud-sdk/bin:/opt/homebrew/bin:$PATH"

# ==============================================================================
# Google Cloud Platform Deployment Script
# Target Project: gmp-demo-project-569655961
# Target Service: Google Maps Platform Suite (Cloud Run)
# ==============================================================================

PROJECT_ID="gmp-demo-project-569655961"
REGION="us-central1"
SERVICE_NAME="google-maps-suite"
IMAGE_TAG="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"

echo "============================================================"
echo "🚀 Deploying Google Maps Platform Suite to Google Cloud Run"
echo "Project ID : ${PROJECT_ID}"
echo "Region     : ${REGION}"
echo "Service    : ${SERVICE_NAME}"
echo "============================================================"

# Ensure gcloud is configured with the target project
echo "▶ Checking gcloud configuration..."
gcloud config set project "${PROJECT_ID}"

# Enable essential GCP APIs
echo "▶ Ensuring Google Cloud APIs are enabled..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    places.googleapis.com \
    routes.googleapis.com \
    geocoding-backend.googleapis.com \
    maps-backend.googleapis.com \
    generativelanguage.googleapis.com \
    --project "${PROJECT_ID}"

# Navigate to root of google_maps project
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

# Build and submit container via Cloud Build
echo "▶ Submitting build to Google Cloud Build..."
gcloud builds submit --tag "${IMAGE_TAG}" . --project "${PROJECT_ID}"

# Deploy to Cloud Run
echo "▶ Deploying container image to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
    --image "${IMAGE_TAG}" \
    --platform managed \
    --region "${REGION}" \
    --project "${PROJECT_ID}" \
    --allow-unauthenticated \
    --set-env-vars="GCP_PROJECT_ID=${PROJECT_ID}"

SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --platform managed --region "${REGION}" --project "${PROJECT_ID}" --format 'value(status.url)')

echo "============================================================"
echo "✅ Deployment Successful!"
echo "Service URL: ${SERVICE_URL}"
echo "============================================================"

