FROM python:3.10-slim

WORKDIR /app

# Copy requirements first to leverage Docker layer caching
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the app
COPY . .

EXPOSE 8000

CMD ["uvicorn", "roomredecor-ml.ml_api:app", "--host", "0.0.0.0", "--port", "8000"]


