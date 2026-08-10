from fastapi import APIRouter, Depends, HTTPException
import uuid
from models import CertificateCreate, CertificateUpdate
from database import supabase
from auth import get_current_user
import local_db

router = APIRouter()

@router.get("")
@router.get("/")
async def get_certificates():
    try:
        response = supabase.table('certificates').select('*').order('display_order').execute()
        if response.data and len(response.data) > 0:
            local_db.set_table('certificates', response.data)
            return response.data
    except Exception as e:
        print(f"Supabase fetch warning for certificates: {e}")
    return local_db.get_table('certificates')

@router.get("/{id}")
async def get_certificate(id: str):
    try:
        response = supabase.table('certificates').select('*').eq('id', id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
    except Exception:
        pass
    certs = local_db.get_table('certificates')
    cert = next((c for c in certs if c.get('id') == id), None)
    if cert:
        return cert
    raise HTTPException(status_code=404, detail="Certificate not found")

@router.post("", dependencies=[Depends(get_current_user)])
@router.post("/", dependencies=[Depends(get_current_user)])
async def create_certificate(cert: CertificateCreate):
    data = cert.model_dump(exclude_unset=True)
    if 'id' not in data or not data['id']:
        data['id'] = str(uuid.uuid4())
    if 'visible' not in data or data['visible'] is None:
        data['visible'] = True
    
    # Save to local disk DB immediately
    local_db.insert_item('certificates', data)
    
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
    updated_local = local_db.update_item('certificates', id, data)
    
    try:
        response = supabase.table('certificates').update(data).eq('id', id).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Supabase sync warning for update_certificate: {e}")
        
    if updated_local:
        return updated_local
    raise HTTPException(status_code=404, detail="Certificate not found")

@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_certificate(id: str):
    local_db.delete_item('certificates', id)
    try:
        supabase.table('certificates').delete().eq('id', id).execute()
    except Exception as e:
        print(f"Supabase sync warning for delete_certificate: {e}")
        
    return {"message": "Certificate deleted successfully"}
