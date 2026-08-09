from fastapi import APIRouter, Depends, HTTPException
import uuid
from models import ProjectCreate, ProjectUpdate
from database import supabase
from auth import get_current_user

router = APIRouter()

IN_MEMORY_PROJECTS = [
    {
        "id": "leesculpt-id",
        "slug": "leesculpt",
        "title": "LeeSculpt Gym Application",
        "short_description": "An AI-powered Gym Management System that connects admins, trainers, and members through personalized fitness tracking, workout and diet management, AI-driven guidance, automated notifications, and real-time progress monitoring.",
        "category": "Web App",
        "technologies": ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Supabase", "Groq API", "Google Gemini", "Tailwind CSS", "SQLAlchemy", "JWT Authentication", "WhatsApp API", "SMTP"],
        "featured": True,
        "published": True,
        "github_url": "https://github.com/Yash-0209-git/gym-management-system",
        "live_url": None,
        "year": 2026,
        "status": "completed",
        "display_order": 0
    }
]

@router.get("")
@router.get("/")
async def get_projects():
    try:
        response = supabase.table('projects').select('*').order('display_order').execute()
        if response.data:
            return response.data
    except Exception:
        pass
    return IN_MEMORY_PROJECTS

@router.get("/{slug}")
async def get_project(slug: str):
    try:
        response = supabase.table('projects').select('*').eq('slug', slug).execute()
        if response.data:
            return response.data[0]
    except Exception:
        pass
    proj = next((p for p in IN_MEMORY_PROJECTS if p.get('slug') == slug or p.get('id') == slug), None)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.post("", dependencies=[Depends(get_current_user)])
@router.post("/", dependencies=[Depends(get_current_user)])
async def create_project(project: ProjectCreate):
    data = project.model_dump(exclude_unset=True)
    if 'id' not in data:
        data['id'] = str(uuid.uuid4())
    IN_MEMORY_PROJECTS.append(data)
    
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
    updated = None
    for i, p in enumerate(IN_MEMORY_PROJECTS):
        if p.get('id') == id or p.get('slug') == id:
            IN_MEMORY_PROJECTS[i].update(data)
            updated = IN_MEMORY_PROJECTS[i]
            break
            
    try:
        response = supabase.table('projects').update(data).eq('id', id).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for update_project: {e}")
        
    if updated:
        return updated
    raise HTTPException(status_code=404, detail="Project not found")

@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_project(id: str):
    global IN_MEMORY_PROJECTS
    IN_MEMORY_PROJECTS = [p for p in IN_MEMORY_PROJECTS if p.get('id') != id and p.get('slug') != id]
    
    try:
        supabase.table('projects').delete().eq('id', id).execute()
    except Exception as e:
        print(f"Supabase sync warning for delete_project: {e}")
        
    return {"message": "Project deleted successfully"}
