from fastapi import APIRouter, Depends, HTTPException
import uuid
from models import CertificateCreate, CertificateUpdate
from database import supabase
from auth import get_current_user

router = APIRouter()

IN_MEMORY_CERTS = []

@router.get("")
@router.get("/")
async def get_certificates():
    try:
        response = supabase.table('certificates').select('*').order('display_order').execute()
        if response.data:
            return response.data
    except Exception:
        pass
    return IN_MEMORY_CERTS

@router.post("", dependencies=[Depends(get_current_user)])
@router.post("/", dependencies=[Depends(get_current_user)])
async def create_certificate(cert: CertificateCreate):
    data = cert.model_dump(exclude_unset=True)
    if 'id' not in data:
        data['id'] = str(uuid.uuid4())
    if 'visible' not in data:
        data['visible'] = True
    IN_MEMORY_CERTS.append(data)
    
    try:
        response = supabase.table('certificates').insert(data).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for create_certificate: {e}")
    return data

@router.put("/{id}", dependencies=[Depends(get_current_user)])
async def update_certificate(id: str, cert: CertificateUpdate):
    data = cert.model_dump(exclude_unset=True)
    updated = None
    for i, c in enumerate(IN_MEMORY_CERTS):
        if c.get('id') == id:
            IN_MEMORY_CERTS[i].update(data)
            updated = IN_MEMORY_CERTS[i]
            break
            
    try:
        response = supabase.table('certificates').update(data).eq('id', id).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for update_certificate: {e}")
        
    if updated:
        return updated
    raise HTTPException(status_code=404, detail="Certificate not found")

@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_certificate(id: str):
    global IN_MEMORY_CERTS
    IN_MEMORY_CERTS = [c for c in IN_MEMORY_CERTS if c.get('id') != id]
    
    try:
        supabase.table('certificates').delete().eq('id', id).execute()
    except Exception as e:
        print(f"Supabase sync warning for delete_certificate: {e}")
        
    return {"message": "Certificate deleted successfully"}
