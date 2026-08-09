from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from routers import auth, projects, skills, certificates, achievements, about, media, settings, dashboard

app = FastAPI(title="Yash Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(skills.router, prefix="/api/skills", tags=["skills"])
app.include_router(certificates.router, prefix="/api/certificates", tags=["certificates"])
app.include_router(achievements.router, prefix="/api/achievements", tags=["achievements"])
app.include_router(about.router, prefix="/api/about", tags=["about"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])
app.include_router(media.router, prefix="/api/media", tags=["media"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

@app.get("/")
async def health_check():
    return {"status": "ok", "message": "Yash Portfolio API is running"}

@app.on_event("startup")
async def startup_event():
    print("FastAPI Portfolio backend is starting up...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
