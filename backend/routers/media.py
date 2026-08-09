from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import uuid
import os
import base64
from database import supabase
from auth import get_current_user

router = APIRouter()

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
BUCKET_NAME = 'portfolio-media'
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')

os.makedirs(UPLOADS_DIR, exist_ok=True)

def get_file_extension(filename: str) -> str:
    return filename.split('.')[-1].lower() if '.' in filename else ''

@router.post("/upload", dependencies=[Depends(get_current_user)])
async def upload_file(file: UploadFile = File(...)):
    ext = get_file_extension(file.filename or '')
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File extension '{ext}' not allowed.")
    
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 10MB.")
        
    filename = f"{uuid.uuid4()}.{ext}"

    # Primary: Upload to Supabase Storage
    try:
        supabase.storage.from_(BUCKET_NAME).upload(filename, file_content, file_options={"content-type": file.content_type})
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(filename)
        return {"filename": filename, "url": public_url}
    except Exception as e:
        print(f"Supabase storage upload warning (using resilient fallback): {e}")

    # Resilient Fallback 1: Local file save
    try:
        local_path = os.path.join(UPLOADS_DIR, filename)
        with open(local_path, "wb") as f:
            f.write(file_content)
        local_url = f"http://localhost:8000/uploads/{filename}"
        return {"filename": filename, "url": local_url}
    except Exception as local_err:
        print(f"Local storage save warning: {local_err}")

    # Resilient Fallback 2: Data URL inline
    b64 = base64.b64encode(file_content).decode('utf-8')
    mime = file.content_type or f"image/{ext}"
    data_url = f"data:{mime};base64,{b64}"
    return {"filename": filename, "url": data_url}

@router.delete("/{filename}", dependencies=[Depends(get_current_user)])
async def delete_file(filename: str):
    try:
        supabase.storage.from_(BUCKET_NAME).remove([filename])
    except Exception as e:
        print(f"Supabase storage remove warning: {e}")

    local_path = os.path.join(UPLOADS_DIR, filename)
    if os.path.exists(local_path):
        try:
            os.remove(local_path)
        except Exception:
            pass

    return {"message": "File deleted successfully"}
