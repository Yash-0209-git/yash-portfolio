from fastapi import APIRouter, Depends
from models import AboutUpdate
from database import supabase
from auth import get_current_user
import local_db

router = APIRouter()

@router.get("")
@router.get("/")
async def get_about():
    try:
        response = supabase.table('about').select('*').eq('id', 1).execute()
        if response.data and len(response.data) > 0:
            local_db.update_single_row('about', response.data[0])
            return response.data[0]
    except Exception as e:
        print(f"Supabase fetch warning for about: {e}")
    return local_db.load_db().get('about', {})

@router.put("")
@router.put("/", dependencies=[Depends(get_current_user)])
async def update_about(about: AboutUpdate):
    data = about.model_dump(exclude_unset=True)
    updated_local = local_db.update_single_row('about', data)
    try:
        response = supabase.table('about').update(data).eq('id', 1).execute()
        if not response.data:
            data['id'] = 1
            supabase.table('about').insert(data).execute()
    except Exception as e:
        print(f"Supabase sync warning for about: {e}")
    return updated_local
