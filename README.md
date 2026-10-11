
## Ishga tushirish

**Backend va baza (Docker orqali):**

```bash
docker compose up --build
```

Backend `http://127.0.0.1:8000` manzilida ishlaydi, API hujjatlari esa `http://127.0.0.1:8000/docs` da.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` manzilida ochiladi va so'rovlarni backendga yo'naltiradi.

## Sozlamalar

Maxfiy ma'lumotlar (baza manzili, kalitlar) loyiha ildizidagi `.env` faylda saqlanadi.
Bu fayl GitHub'ga yuklanmaydi, uni har bir ishlab chiquvchi o'zi yaratadi.

## Jamoa bilan ishlash

- Asosiy ish branchi: `feature/map-route`
- Har bir yangi vazifa alohida branchda bajariladi va Pull Request orqali qo'shiladi
- Frontend o'zgarishlari faqat `frontend/` papkasi ichida qilinadi