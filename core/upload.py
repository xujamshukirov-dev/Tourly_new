"""Fayl yuklash: rasm/video/PDF ni media/uploads/ ga saqlab, qisqa URL qaytaradi."""
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from core.security import get_current_user
from users.models import User

MEDIA_ROOT = Path("media")
UPLOAD_DIR = MEDIA_ROOT / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ruxsat etilgan turlar: content-type -> (kengaytma, maksimal hajm MB)
RUXSAT = {
    "image/jpeg": (".jpg", 10),
    "image/png": (".png", 10),
    "image/webp": (".webp", 10),
    "image/gif": (".gif", 10),
    "application/pdf": (".pdf", 10),
    "video/mp4": (".mp4", 100),
    "video/quicktime": (".mov", 100),
}

router = APIRouter(prefix="/api", tags=["upload"])


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in RUXSAT:
        raise HTTPException(status_code=400, detail="Bu turdagi faylga ruxsat yo'q")

    ext, max_mb = RUXSAT[file.content_type]
    max_bayt = max_mb * 1024 * 1024
    nom = f"{uuid.uuid4().hex}{ext}"
    yol = UPLOAD_DIR / nom

    hajm = 0
    try:
        with open(yol, "wb") as f:
            while chunk := await file.read(1024 * 1024):
                hajm += len(chunk)
                if hajm > max_bayt:
                    raise HTTPException(status_code=413, detail=f"Fayl {max_mb} MB dan katta")
                f.write(chunk)
    except HTTPException:
        yol.unlink(missing_ok=True)
        raise

    return {"url": f"/media/uploads/{nom}", "filename": nom}
