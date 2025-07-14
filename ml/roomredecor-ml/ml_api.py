# backend/ml_api.py

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import shutil
import time

from run_pipeline import main

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/output", StaticFiles(directory="data/output_images"), name="output")


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    # 1) Save the upload
    temp_dir = Path("data/temp")
    temp_dir.mkdir(parents=True, exist_ok=True)
    temp_path = temp_dir / file.filename
    with open(temp_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    # 2) Record the “start” time
    start_ts = time.time()

    try:
        # 3) Run the pipeline (which writes new files)
        main(str(temp_path))

        # 4) Gather only files modified after we started
        out_dir = Path("data/output_images")
        urls = []
        for p in sorted(out_dir.iterdir()):
            if p.is_file() and p.stat().st_mtime >= start_ts:
                urls.append(f"/output/{p.name}")

        return JSONResponse({
            "success": True,
            "message": "Image processed successfully",
            "output_images": urls
        })

    except Exception as e:
        return JSONResponse({
            "success": False,
            "error": str(e)
        }, status_code=500)
