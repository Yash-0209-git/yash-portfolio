from fastapi import APIRouter, Depends
from models import SettingsUpdate
from database import supabase
from auth import get_current_user

router = APIRouter()

IN_MEMORY_SETTINGS = {
    "id": 1,
    "email": "yashwanth02092006@gmail.com",
    "github_url": "https://github.com/Yash-0209-git",
    "linkedin_url": "https://www.linkedin.com/in/yashwanth-c-918a53317",
    "instagram_handle": "yashhwanth__",
    "resume_url": None
}

@router.get("")
@router.get("/")
async def get_settings():
    try:
        response = supabase.table('settings').select('*').eq('id', 1).execute()
        if response.data and response.data[0]:
            IN_MEMORY_SETTINGS.update(response.data[0])
    except Exception:
        pass
    return IN_MEMORY_SETTINGS

@router.put("")
@router.put("/", dependencies=[Depends(get_current_user)])
async def update_settings(settings: SettingsUpdate):
    data = settings.model_dump(exclude_unset=True)
    IN_MEMORY_SETTINGS.update(data)
    try:
        response = supabase.table('settings').update(data).eq('id', 1).execute()
        if not response.data:
            data['id'] = 1
            supabase.table('settings').insert(data).execute()
    except Exception as e:
        print(f"Supabase sync warning for settings: {e}")
    return IN_MEMORY_SETTINGS
