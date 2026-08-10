from fastapi import APIRouter, Depends, HTTPException
import uuid
from models import ProjectCreate, ProjectUpdate
from database import supabase
from auth import get_current_user
import local_db

router = APIRouter()

@router.get("")
@router.get("/")
async def get_projects():
    try:
        response = supabase.table('projects').select('*').order('display_order').execute()
        if response.data and len(response.data) > 0:
            local_db.set_table('projects', response.data)
            return response.data
    except Exception as e:
        print(f"Supabase fetch warning for projects: {e}")
    return local_db.get_table('projects')

@router.get("/{slug}")
async def get_project(slug: str):
    try:
        response = supabase.table('projects').select('*').eq('slug', slug).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
    except Exception:
        pass
    items = local_db.get_table('projects')
    proj = next((p for p in items if p.get('slug') == slug or p.get('id') == slug), None)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.post("", dependencies=[Depends(get_current_user)])
@router.post("/", dependencies=[Depends(get_current_user)])
async def create_project(project: ProjectCreate):
    data = project.model_dump(exclude_unset=True)
    if 'id' not in data or not data['id']:
        data['id'] = str(uuid.uuid4())
    
    local_db.insert_item('projects', data)
    
    try:
        response = supabase.table('projects').insert(data).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for create_project: {e}")
    return data

@router.put("/{id}", dependencies=[Depends(get_current_user)])
async def update_project(id: str, project: ProjectUpdate):
    data = project.model_dump(exclude_unset=True)
    updated_local = local_db.update_item('projects', id, data)
    
    try:
        response = supabase.table('projects').update(data).eq('id', id).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for update_project: {e}")
        
    if updated_local:
        return updated_local
    raise HTTPException(status_code=404, detail="Project not found")

@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_project(id: str):
    local_db.delete_item('projects', id)
    try:
        supabase.table('projects').delete().eq('id', id).execute()
    except Exception as e:
        print(f"Supabase sync warning for delete_project: {e}")
        
    return {"message": "Project deleted successfully"}
