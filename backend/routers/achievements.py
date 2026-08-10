from fastapi import APIRouter, Depends, HTTPException
import uuid
from models import AchievementCreate, AchievementUpdate
from database import supabase
from auth import get_current_user
import local_db

router = APIRouter()

@router.get("")
@router.get("/")
async def get_achievements():
    try:
        response = supabase.table('achievements').select('*').order('display_order').execute()
        if response.data and len(response.data) > 0:
            local_db.set_table('achievements', response.data)
            return response.data
    except Exception as e:
        print(f"Supabase fetch warning for achievements: {e}")
    return local_db.get_table('achievements')

@router.get("/{id}")
async def get_achievement(id: str):
    try:
        response = supabase.table('achievements').select('*').eq('id', id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
    except Exception:
        pass
    items = local_db.get_table('achievements')
    item = next((a for a in items if a.get('id') == id), None)
    if item:
        return item
    raise HTTPException(status_code=404, detail="Achievement not found")

@router.post("", dependencies=[Depends(get_current_user)])
@router.post("/", dependencies=[Depends(get_current_user)])
async def create_achievement(achieve: AchievementCreate):
    data = achieve.model_dump(exclude_unset=True)
    if 'id' not in data or not data['id']:
        data['id'] = str(uuid.uuid4())
    if 'visible' not in data or data['visible'] is None:
        data['visible'] = True
    
    local_db.insert_item('achievements', data)
    
    try:
        response = supabase.table('achievements').insert(data).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for create_achievement: {e}")
    return data

@router.put("/{id}", dependencies=[Depends(get_current_user)])
async def update_achievement(id: str, achieve: AchievementUpdate):
    data = achieve.model_dump(exclude_unset=True)
    updated_local = local_db.update_item('achievements', id, data)
    
    try:
        response = supabase.table('achievements').update(data).eq('id', id).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for update_achievement: {e}")
        
    if updated_local:
        return updated_local
    raise HTTPException(status_code=404, detail="Achievement not found")

@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_achievement(id: str):
    local_db.delete_item('achievements', id)
    try:
        supabase.table('achievements').delete().eq('id', id).execute()
    except Exception as e:
        print(f"Supabase sync warning for delete_achievement: {e}")
        
    return {"message": "Achievement deleted successfully"}
