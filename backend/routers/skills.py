from fastapi import APIRouter, Depends, HTTPException
import uuid
from models import SkillCreate, SkillUpdate
from database import supabase
from auth import get_current_user

router = APIRouter()

IN_MEMORY_SKILLS = [
    {"id": "1", "name": "Python", "category": "Languages", "display_order": 0},
    {"id": "2", "name": "TypeScript", "category": "Languages", "display_order": 1},
    {"id": "3", "name": "FastAPI", "category": "Backend", "display_order": 0},
    {"id": "4", "name": "SQLAlchemy", "category": "Backend", "display_order": 1},
    {"id": "5", "name": "REST APIs", "category": "Backend", "display_order": 2},
    {"id": "6", "name": "JWT Authentication", "category": "Backend", "display_order": 3},
    {"id": "7", "name": "React", "category": "Frontend", "display_order": 0},
    {"id": "8", "name": "Tailwind CSS", "category": "Frontend", "display_order": 1},
    {"id": "9", "name": "PostgreSQL", "category": "Database", "display_order": 0},
    {"id": "10", "name": "Supabase", "category": "Database", "display_order": 1},
    {"id": "11", "name": "AI/LLMs", "category": "AI & ML", "display_order": 0},
    {"id": "12", "name": "RAG", "category": "AI & ML", "display_order": 1},
    {"id": "13", "name": "Groq API", "category": "AI & ML", "display_order": 2},
    {"id": "14", "name": "API Integration", "category": "Tools", "display_order": 0},
    {"id": "15", "name": "Git/GitHub", "category": "Tools", "display_order": 1}
]

@router.get("")
@router.get("/")
async def get_skills():
    try:
        response = supabase.table('skills').select('*').order('display_order').execute()
        if response.data:
            return response.data
    except Exception:
        pass
    return IN_MEMORY_SKILLS

@router.post("", dependencies=[Depends(get_current_user)])
@router.post("/", dependencies=[Depends(get_current_user)])
async def create_skill(skill: SkillCreate):
    data = skill.model_dump(exclude_unset=True)
    if 'id' not in data:
        data['id'] = str(uuid.uuid4())
    IN_MEMORY_SKILLS.append(data)
    
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
    updated = None
    for i, s in enumerate(IN_MEMORY_SKILLS):
        if s.get('id') == id:
            IN_MEMORY_SKILLS[i].update(data)
            updated = IN_MEMORY_SKILLS[i]
            break
            
    try:
        response = supabase.table('skills').update(data).eq('id', id).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for update_skill: {e}")
        
    if updated:
        return updated
    raise HTTPException(status_code=404, detail="Skill not found")

@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_skill(id: str):
    global IN_MEMORY_SKILLS
    IN_MEMORY_SKILLS = [s for s in IN_MEMORY_SKILLS if s.get('id') != id]
    
    try:
        supabase.table('skills').delete().eq('id', id).execute()
    except Exception as e:
        print(f"Supabase sync warning for delete_skill: {e}")
        
    return {"message": "Skill deleted successfully"}
