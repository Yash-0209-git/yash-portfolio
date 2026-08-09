from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import uuid
from database import supabase
from auth import get_current_user

router = APIRouter()

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
BUCKET_NAME = 'portfolio-media'

def get_file_extension(filename: str) -> str:
    return filename.split('.')[-1].lower() if '.' in filename else ''

@router.post("/upload", dependencies=[Depends(get_current_user)])
async def upload_file(file: UploadFile = File(...)):
    ext = get_file_extension(file.filename)
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File extension '{ext}' not allowed.")
    
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 10MB.")
        
    try:
        filename = f"{uuid.uuid4()}.{ext}"
        
        # Upload to Supabase Storage
        supabase.storage.from_(BUCKET_NAME).upload(filename, file_content, file_options={"content-type": file.content_type})
        
        # Get public URL
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(filename)
        
        return {"filename": filename, "url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{filename}", dependencies=[Depends(get_current_user)])
async def delete_file(filename: str):
    try:
        res = supabase.storage.from_(BUCKET_NAME).remove([filename])
        if not res:
            raise HTTPException(status_code=404, detail="File not found or failed to delete")
        return {"message": "File deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
