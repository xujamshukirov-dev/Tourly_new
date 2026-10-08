import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

import { DatabaseSync } from 'node:sqlite'

// Vite plugin to handle multipart file uploads at /api/upload
function tourlyUploadPlugin() {
  return {
    name: 'tourly-upload-handler',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/upload' && req.method === 'POST') {
          const contentType = req.headers['content-type'] || '';
          const match = contentType.match(/boundary=([^;]+)/i);
          const boundary = match ? match[1].trim() : null;

          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const buffer = Buffer.concat(chunks);
              let filename = `upload_${Date.now()}.jpg`;
              let fileData = buffer;

              if (boundary) {
                const boundaryBuf = Buffer.from('--' + boundary);
                const start = buffer.indexOf(boundaryBuf);
                if (start !== -1) {
                  const end = buffer.indexOf(boundaryBuf, start + boundaryBuf.length);
                  if (end !== -1) {
                    const part = buffer.slice(start + boundaryBuf.length, end);
                    const headerEnd = part.indexOf('\r\n\r\n');
                    if (headerEnd !== -1) {
                      const headerStr = part.slice(0, headerEnd).toString('utf-8');
                      const fnMatch = headerStr.match(/filename="([^"]+)"/i);
                      if (fnMatch) {
                        const rawName = fnMatch[1].replace(/[^a-zA-Z0-9._-]/g, '_');
                        filename = `${Date.now()}_${rawName}`;
                      }
                      fileData = part.slice(headerEnd + 4, part.length - 2);
                    }
                  }
                }
              }

              const uploadDir = path.resolve(process.cwd(), 'public/uploads');
              if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
              }
              const filePath = path.join(uploadDir, filename);
              fs.writeFileSync(filePath, fileData);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  url: `/uploads/${filename}`,
                  filename,
                  status: 'success',
                  message: 'Fayl muvaffaqiyatli yuklandi',
                })
              );
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ detail: err.message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// Vite plugin to provide 100% Swagger compatibility for endpoints that FastAPI starlette order blocks
function tourlyApiCompatPlugin() {
  const dbPath = path.resolve(process.cwd(), '../db.sqlite3');
  let dbInstance = null;

  function getDb() {
    if (!dbInstance && fs.existsSync(dbPath)) {
      try {
        dbInstance = new DatabaseSync(dbPath);
      } catch (e) {
        console.warn('[Vite SQLite] Ulanishda xato:', e.message);
      }
    }
    return dbInstance;
  }

  function getUserIdFromAuthHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return 4;
    const token = authHeader.slice(7).trim();
    const parts = token.split('.');
    if (parts.length !== 3) return 4;
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
      return payload.sub ? parseInt(payload.sub, 10) : 4;
    } catch {
      return 4;
    }
  }

  return {
    name: 'tourly-api-compat-handler',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlObj = new URL(req.url, 'http://localhost');
        const pathname = urlObj.pathname;

        // 1. GET /menu/tour/kompaniya - Starlette /{category}/{verification_id} int xatosidan himoya
        if (req.method === 'GET' && pathname === '/menu/tour/kompaniya') {
          const db = getDb();
          if (db) {
            try {
              const rows = db.prepare('SELECT id, company_name, phone, address, logo, status FROM tour_kompaniya WHERE status = ?').all('approved');
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(rows));
              return;
            } catch (err) {
              console.warn('[Vite API Compat] /menu/tour/kompaniya xatosi:', err.message);
            }
          }
        }

        // 2. POST /menu/guide - Backend GuideVerification modelida latitude yo'qligi sababli to'g'ridan-to'g'ri bazaga yozish
        if (req.method === 'POST' && pathname === '/menu/guide') {
          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const rawBody = Buffer.concat(chunks).toString('utf-8');
              const data = JSON.parse(rawBody || '{}');
              const db = getDb();
              if (!db) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ detail: 'Baza ulanishi mavjud emas' }));
                return;
              }

              const userId = getUserIdFromAuthHeader(req.headers['authorization']);
              const existing = db.prepare('SELECT id FROM guide_verifications WHERE user_id = ?').get(userId);
              if (existing) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ detail: 'Siz allaqachon ariza topshirgansiz!' }));
                return;
              }

              const stmt = db.prepare(`
                INSERT INTO guide_verifications (
                  user_id, first_name, last_name, email, phone, passport_series, passport_image,
                  viloyat, tuman, language, bio, image, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
              `);

              const info = stmt.run(
                userId,
                data.first_name || '',
                data.last_name || '',
                data.email || '',
                data.phone || '',
                data.passport_series || '',
                data.passport_image || null,
                data.viloyat || 'Toshkent shahri',
                data.tuman || 'Chilonzor',
                data.language || "O'zbekcha, Ruscha",
                data.bio || '',
                data.image || null
              );

              const created = db.prepare('SELECT * FROM guide_verifications WHERE id = ?').get(info.lastInsertRowid);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(created));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ detail: err.message }));
            }
          });
          return;
        }

        // 3. POST /menu/taxi - Backend TaxiVerification modelida latitude yo'qligi sababli to'g'ridan-to'g'ri bazaga yozish
        if (req.method === 'POST' && pathname === '/menu/taxi') {
          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const rawBody = Buffer.concat(chunks).toString('utf-8');
              const data = JSON.parse(rawBody || '{}');
              const db = getDb();
              if (!db) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ detail: 'Baza ulanishi mavjud emas' }));
                return;
              }

              const userId = getUserIdFromAuthHeader(req.headers['authorization']);
              const existing = db.prepare('SELECT id FROM taxi_verifications WHERE user_id = ?').get(userId);
              if (existing) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ detail: 'Siz allaqachon ariza topshirgansiz!' }));
                return;
              }

              const stmt = db.prepare(`
                INSERT INTO taxi_verifications (
                  user_id, first_name, last_name, email, phone, passport_series, passport_image,
                  viloyat, tuman, car_model, car_number, bio, image, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
              `);

              const info = stmt.run(
                userId,
                data.first_name || '',
                data.last_name || '',
                data.email || '',
                data.phone || '',
                data.passport_series || '',
                data.passport_image || null,
                data.viloyat || 'Toshkent shahri',
                data.tuman || 'Chilonzor',
                data.car_model || 'Chevrolet Cobalt',
                data.car_number || '01 A 001 AA',
                data.bio || '',
                data.image || null
              );

              const created = db.prepare('SELECT * FROM taxi_verifications WHERE id = ?').get(info.lastInsertRowid);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(created));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ detail: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    tourlyUploadPlugin(),
    tourlyApiCompatPlugin(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/menu': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/bookings': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/posts': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/route': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/asosiy': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/ai': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/messages': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/notifications': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
