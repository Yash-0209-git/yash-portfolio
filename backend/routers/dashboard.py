from fastapi import APIRouter, HTTPException
from database import supabase

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats():
    try:
        projects_res = supabase.table('projects').select('id, published', count='exact').execute()
        certs_res = supabase.table('certificates').select('id', count='exact').execute()
        achieve_res = supabase.table('achievements').select('id', count='exact').execute()

        projects = projects_res.data or []
        total_projects = len(projects)
        published_projects = sum(1 for p in projects if p.get('published'))
        certificates = len(certs_res.data or [])
        achievements = len(achieve_res.data or [])

        return {
            "projects": total_projects,
            "published_projects": published_projects,
            "certificates": certificates,
            "achievements": achievements
        }
    except Exception as e:
        # Fallback graceful response
        return {
            "projects": 0,
            "published_projects": 0,
            "certificates": 0,
            "achievements": 0
        }
