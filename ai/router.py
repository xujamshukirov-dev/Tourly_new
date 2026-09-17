import httpx
import os
from fastapi import APIRouter, Depends, HTTPException
from core.security import get_current_user
from users.models import User
from ai import schemas

router = APIRouter(prefix="/ai", tags=["ai"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"


@router.post("/ask", response_model=schemas.AnswerResponse)
async def ask_ai(
    data: schemas.QuestionRequest,
    current_user: User = Depends(get_current_user),
):
    if not data.question:
        raise HTTPException(status_code=400, detail="Savol yozing!")

    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY sozlanmagan")

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                f"{GEMINI_URL}?key={GEMINI_API_KEY}",
                json={"contents": [{"parts": [{"text": data.question}]}]},
            )
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Gemini API bilan bog'lanib bo'lmadi")

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Gemini API xato qaytardi")

    result = response.json()

    try:
        answer = result["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        raise HTTPException(status_code=502, detail="Gemini javob formati kutilganidek emas")

    return schemas.AnswerResponse(answer=answer)