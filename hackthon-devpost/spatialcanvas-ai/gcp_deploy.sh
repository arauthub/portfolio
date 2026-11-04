#!/usr/bin/env bash
# ==============================================================================
# SpatialCanvas AI - Google Cloud Platform (GCP) One-Click Deployment Script
# Deploys FastAPI backend + WebXR frontend to Google Cloud Run
# ==============================================================================

set -e

PROJECT_ID=${1:-$GCP_PROJECT_ID}
REGION=${2:-"us-central1"}
SERVICE_NAME="spatialcanvas-ai"

if [ -z "$PROJECT_ID" ]; then
    echo "⚠️  GCP_PROJECT_ID not specified."
    echo "Usage: ./gcp_deploy.sh <YOUR_GCP_PROJECT_ID> [REGION]"
    exit 1
fi

echo "🚀 Deploying SpatialCanvas AI to Google Cloud Platform..."
echo "📍 Project: $PROJECT_ID"
echo "📍 Region:  $REGION"
echo "📍 Service: $SERVICE_NAME"

# 1. Configure GCP Project
gcloud config set project "$PROJECT_ID"

# 2. Enable Required GCP APIs
echo "🔧 Enabling GCP APIs: Cloud Run, Artifact Registry, Vertex AI, Cloud Build..."
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    aiplatform.googleapis.com \
    cloudbuild.googleapis.com

# 3. Submit Build via Cloud Build
echo "📦 Building container image via Cloud Build..."
gcloud builds submit --tag "gcr.io/$PROJECT_ID/$SERVICE_NAME:latest" .

# 4. Deploy to Cloud Run
echo "🚀 Launching on Google Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image "gcr.io/$PROJECT_ID/$SERVICE_NAME:latest" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --timeout 3600 \
    --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID,VERTEX_AI_MODEL=gemini-2.0-flash,DEBUG=False"

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format 'value(status.url)')

echo ""
echo "=============================================================================="
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "🌐 SpatialCanvas AI Live URL: $SERVICE_URL"
echo "🥽 Meta Quest Browser: Open $SERVICE_URL on your Quest 2/3/Pro headset"
echo "🖥️ Desktop Simulator: Open $SERVICE_URL in any Chrome/Edge/Firefox browser"
echo "=============================================================================="

