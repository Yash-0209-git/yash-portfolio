from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class LoginRequest(BaseModel):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ProjectBase(BaseModel):
    slug: str
    title: str
    short_description: Optional[str] = None
    category: Optional[str] = 'Web App'
    technologies: List[str] = []
    thumbnail_url: Optional[str] = None
    gallery_urls: List[str] = []
    featured: Optional[bool] = False
    published: Optional[bool] = True
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    year: Optional[int] = None
    status: Optional[str] = 'completed'
    display_order: Optional[int] = 0
    problem: Optional[str] = None
    solution: Optional[str] = None
    challenges: Optional[str] = None
    results: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    slug: Optional[str] = None
    title: Optional[str] = None

class SkillBase(BaseModel):
    name: str
    category: str
    display_order: Optional[int] = 0

class SkillCreate(SkillBase):
    pass

class SkillUpdate(SkillBase):
    name: Optional[str] = None
    category: Optional[str] = None

class CertificateBase(BaseModel):
    title: str
    issuer: Optional[str] = None
    issue_date: Optional[date] = None
    credential_id: Optional[str] = None
    verification_url: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    visible: Optional[bool] = True
    display_order: Optional[int] = 0

class CertificateCreate(CertificateBase):
    pass

class CertificateUpdate(CertificateBase):
    title: Optional[str] = None

class AchievementBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: Optional[date] = None
    organization: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    visible: Optional[bool] = True
    display_order: Optional[int] = 0

class AchievementCreate(AchievementBase):
    pass

class AchievementUpdate(AchievementBase):
    title: Optional[str] = None

class AboutBase(BaseModel):
    name: Optional[str] = 'C Yashwanth'
    role: Optional[str] = 'AI Full Stack Developer'
    tagline: Optional[str] = 'Ideas, engineered into reality.'
    bio: Optional[str] = None
    profile_photo_url: Optional[str] = None

class AboutUpdate(AboutBase):
    pass

class SettingsBase(BaseModel):
    email: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_handle: Optional[str] = None
    resume_url: Optional[str] = None

class SettingsUpdate(SettingsBase):
    pass
