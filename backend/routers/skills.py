from fastapi import APIRouter, Depends, HTTPException
import uuid
from models import SkillCreate, SkillUpdate
from database import supabase
from auth import get_current_user
import local_db

router = APIRouter()

@router.get("")
@router.get("/")
async def get_skills():
    try:
        response = supabase.table('skills').select('*').order('display_order').execute()
        if response.data and len(response.data) > 0:
            local_db.set_table('skills', response.data)
            return response.data
    except Exception as e:
        print(f"Supabase fetch warning for skills: {e}")
    return local_db.get_table('skills')

@router.post("", dependencies=[Depends(get_current_user)])
@router.post("/", dependencies=[Depends(get_current_user)])
async def create_skill(skill: SkillCreate):
    data = skill.model_dump(exclude_unset=True)
    if 'id' not in data or not data['id']:
        data['id'] = str(uuid.uuid4())
    
    local_db.insert_item('skills', data)
    
    try:
        response = supabase.table('skills').insert(data).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for create_skill: {e}")
    return data

@router.put("/{id}", dependencies=[Depends(get_current_user)])
async def update_skill(id: str, skill: SkillUpdate):
    data = skill.model_dump(exclude_unset=True)
    updated_local = local_db.update_item('skills', id, data)
    
    try:
        response = supabase.table('skills').update(data).eq('id', id).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for update_skill: {e}")
        
    if updated_local:
        return updated_local
    raise HTTPException(status_code=404, detail="Skill not found")

@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_skill(id: str):
    local_db.delete_item('skills', id)
    try:
        supabase.table('skills').delete().eq('id', id).execute()
    except Exception as e:
        print(f"Supabase sync warning for delete_skill: {e}")
        
    return {"message": "Skill deleted successfully"}
