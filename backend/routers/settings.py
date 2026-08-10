from fastapi import APIRouter, Depends
from models import SettingsUpdate
from database import supabase
from auth import get_current_user
import local_db

router = APIRouter()

@router.get("")
@router.get("/")
async def get_settings():
    try:
        response = supabase.table('settings').select('*').eq('id', 1).execute()
        if response.data and len(response.data) > 0:
            local_db.update_single_row('settings', response.data[0])
            return response.data[0]
    except Exception as e:
        print(f"Supabase fetch warning for settings: {e}")
    return local_db.load_db().get('settings', {})

@router.put("")
@router.put("/", dependencies=[Depends(get_current_user)])
async def update_settings(settings: SettingsUpdate):
    data = settings.model_dump(exclude_unset=True)
    updated_local = local_db.update_single_row('settings', data)
    try:
        response = supabase.table('settings').update(data).eq('id', 1).execute()
        if not response.data:
            data['id'] = 1
            supabase.table('settings').insert(data).execute()
    except Exception as e:
        print(f"Supabase sync warning for settings: {e}")
    return updated_local
