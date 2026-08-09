from fastapi import APIRouter, Depends, HTTPException
import uuid
from models import AchievementCreate, AchievementUpdate
from database import supabase
from auth import get_current_user

router = APIRouter()

IN_MEMORY_ACHIEVEMENTS = []

@router.get("")
@router.get("/")
async def get_achievements():
    try:
        response = supabase.table('achievements').select('*').order('display_order').execute()
        if response.data:
            return response.data
    except Exception:
        pass
    return IN_MEMORY_ACHIEVEMENTS

@router.post("", dependencies=[Depends(get_current_user)])
@router.post("/", dependencies=[Depends(get_current_user)])
async def create_achievement(achieve: AchievementCreate):
    data = achieve.model_dump(exclude_unset=True)
    if 'id' not in data:
        data['id'] = str(uuid.uuid4())
    if 'visible' not in data:
        data['visible'] = True
    IN_MEMORY_ACHIEVEMENTS.append(data)
    
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
    updated = None
    for i, a in enumerate(IN_MEMORY_ACHIEVEMENTS):
        if a.get('id') == id:
            IN_MEMORY_ACHIEVEMENTS[i].update(data)
            updated = IN_MEMORY_ACHIEVEMENTS[i]
            break
            
    try:
        response = supabase.table('achievements').update(data).eq('id', id).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for update_achievement: {e}")
        
    if updated:
        return updated
    raise HTTPException(status_code=404, detail="Achievement not found")

@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_achievement(id: str):
    global IN_MEMORY_ACHIEVEMENTS
    IN_MEMORY_ACHIEVEMENTS = [a for a in IN_MEMORY_ACHIEVEMENTS if a.get('id') != id]
    
    try:
        supabase.table('achievements').delete().eq('id', id).execute()
    except Exception as e:
        print(f"Supabase sync warning for delete_achievement: {e}")
        
    return {"message": "Achievement deleted successfully"}
