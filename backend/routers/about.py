from fastapi import APIRouter, Depends
from models import AboutUpdate
from database import supabase
from auth import get_current_user

router = APIRouter()

IN_MEMORY_ABOUT = {
    "id": 1,
    "name": "C Yashwanth",
    "role": "AI Full Stack Developer",
    "tagline": "Ideas, engineered into reality.",
    "bio": "An AI/ML-focused developer who enjoys building practical, intelligent software that solves real-world problems. I work across Python, FastAPI, React, PostgreSQL, and AI/LLM technologies, with a strong interest in backend architecture, intelligent automation, and building polished user experiences.",
    "profile_photo_url": None
}

@router.get("")
@router.get("/")
async def get_about():
    try:
        response = supabase.table('about').select('*').eq('id', 1).execute()
        if response.data and response.data[0]:
            IN_MEMORY_ABOUT.update(response.data[0])
    except Exception:
        pass
    return IN_MEMORY_ABOUT

@router.put("")
@router.put("/", dependencies=[Depends(get_current_user)])
async def update_about(about: AboutUpdate):
    data = about.model_dump(exclude_unset=True)
    IN_MEMORY_ABOUT.update(data)
    try:
        response = supabase.table('about').update(data).eq('id', 1).execute()
        if not response.data:
            data['id'] = 1
            supabase.table('about').insert(data).execute()
    except Exception as e:
        print(f"Supabase sync warning for about: {e}")
    return IN_MEMORY_ABOUT
