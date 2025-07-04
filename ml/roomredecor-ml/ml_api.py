from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import shutil
from run_pipeline import main
from pathlib import Path

app = FastAPI()

@app.post("/process")
async def process_image(file: UploadFile = File(...)):
    temp_dir = Path("data/temp")
    temp_dir.mkdir(parents=True, exist_ok=True)

    temp_path = temp_dir / file.filename
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        main(str(temp_path))
        return JSONResponse(content={"message": "Image processed successfully"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
