#!/usr/bin/env bash

# Start ML backend
cd ml/roomredecor-ml
uvicorn ml_api:app --host 0.0.0.0 --port 5001 --reload &

# Start frontend
cd /workspaces/redecorai
npm run dev
