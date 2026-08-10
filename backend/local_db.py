import json
import os
import threading
from typing import Dict, Any, List

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
DB_FILE = os.path.join(DATA_DIR, 'db.json')
_lock = threading.Lock()

INITIAL_DB: Dict[str, Any] = {
    "projects": [
        {
            "id": "leesculpt",
            "slug": "leesculpt",
            "title": "LeeSculpt Gym Application",
            "short_description": "An AI-powered Gym Management System that connects admins, trainers, and members through personalized fitness tracking, workout and diet management, AI-driven guidance, automated notifications, and real-time progress monitoring.",
            "category": "Web App",
            "year": 2026,
            "status": "completed",
            "github_url": "https://github.com/Yash-0209-git/gym-management-system",
            "technologies": [
                "Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Supabase",
                "Groq API", "Google Gemini", "SQLAlchemy", "JWT Authentication", "WhatsApp API"
            ],
            "featured": True,
            "published": True,
            "display_order": 0,
            "problem": "Gyms struggle with fragmented communication across members, trainers, and admins, resulting in low member retention, inconsistent workout plans, and unmonitored diet tracking.",
            "solution": "Designed and built a unified full-stack application featuring multi-role access control (Admin, Trainer, Member), automated AI diet & workout recommendation engines via Groq API & Gemini, real-time progress analytics, and instant WhatsApp notification dispatches.",
            "challenges": "Designing a secure multi-role access pipeline with optimistic dual-persistence caching, ensuring instantaneous AI response generation without blocking main event loops."
        }
    ],
    "skills": [
        {"id": "s1", "name": "Python", "category": "Languages", "display_order": 0},
        {"id": "s2", "name": "TypeScript", "category": "Languages", "display_order": 1},
        {"id": "s3", "name": "FastAPI", "category": "Backend", "display_order": 0},
        {"id": "s4", "name": "SQLAlchemy", "category": "Backend", "display_order": 1},
        {"id": "s5", "name": "REST APIs", "category": "Backend", "display_order": 2},
        {"id": "s6", "name": "JWT Authentication", "category": "Backend", "display_order": 3},
        {"id": "s7", "name": "React", "category": "Frontend", "display_order": 0},
        {"id": "s8", "name": "Tailwind CSS", "category": "Frontend", "display_order": 1},
        {"id": "s9", "name": "PostgreSQL", "category": "Database", "display_order": 0},
        {"id": "s10", "name": "Supabase", "category": "Database", "display_order": 1},
        {"id": "s11", "name": "AI/LLMs", "category": "AI & ML", "display_order": 0},
        {"id": "s12", "name": "RAG", "category": "AI & ML", "display_order": 1},
        {"id": "s13", "name": "Groq API", "category": "AI & ML", "display_order": 2},
        {"id": "s14", "name": "API Integration", "category": "Tools", "display_order": 0},
        {"id": "s15", "name": "Git/GitHub", "category": "Tools", "display_order": 1}
    ],
    "certificates": [],
    "achievements": [],
    "about": {
        "name": "C Yashwanth",
        "role": "AI Full Stack Developer",
        "tagline": "Ideas, engineered into reality.",
        "bio": "An AI/ML-focused developer who enjoys building practical, intelligent software that solves real-world problems. I work across Python, FastAPI, React, PostgreSQL, and AI/LLM technologies, with a strong interest in backend architecture, intelligent automation, and building polished user experiences.",
        "profile_photo_url": ""
    },
    "settings": {
        "email": "yashwanth02092006@gmail.com",
        "github_url": "https://github.com/Yash-0209-git",
        "linkedin_url": "https://www.linkedin.com/in/yashwanth-c-918a53317",
        "instagram_handle": "yashhwanth__",
        "resume_url": ""
    }
}

def _init_db():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(INITIAL_DB, f, indent=2, ensure_ascii=False)

_init_db()

def load_db() -> Dict[str, Any]:
    with _lock:
        try:
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return INITIAL_DB.copy()

def save_db(db_data: Dict[str, Any]):
    with _lock:
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(db_data, f, indent=2, ensure_ascii=False)

def get_table(table_name: str) -> Any:
    db = load_db()
    return db.get(table_name, [])

def set_table(table_name: str, data: Any):
    db = load_db()
    db[table_name] = data
    save_db(db)

def insert_item(table_name: str, item: Dict[str, Any]):
    db = load_db()
    if table_name not in db or not isinstance(db[table_name], list):
        db[table_name] = []
    # Replace existing if ID matches
    item_id = item.get('id')
    if item_id:
        db[table_name] = [x for x in db[table_name] if x.get('id') != item_id]
    db[table_name].append(item)
    save_db(db)
    return item

def update_item(table_name: str, item_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    db = load_db()
    items = db.get(table_name, [])
    updated_item = None
    for i, x in enumerate(items):
        if x.get('id') == item_id:
            items[i].update(updates)
            updated_item = items[i]
            break
    if updated_item:
        save_db(db)
    return updated_item

def delete_item(table_name: str, item_id: str):
    db = load_db()
    if table_name in db and isinstance(db[table_name], list):
        db[table_name] = [x for x in db[table_name] if x.get('id') != item_id]
        save_db(db)

def update_single_row(table_name: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    db = load_db()
    row = db.get(table_name, {})
    if isinstance(row, dict):
        row.update(updates)
        db[table_name] = row
    else:
        db[table_name] = updates
    save_db(db)
    return db[table_name]
