#!/usr/bin/env bash
set -e

# Install Python deps
pip install --upgrade pip
pip install fastapi uvicorn python-multipart

# Install Node deps
npm install
git lfs install
