# Fya Credits API

Backend del sistema de gestión de créditos. Express, TypeScript, PostgreSQL.

## Requisitos

- Node.js 18+
- PostgreSQL (local o Neon/Supabase)
- Redis (opcional): cola Bull para emails. Sin Redis, se envían directamente.

## Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env` con tus credenciales y ejecuta:

```bash
npm run migrate
npm run seed   # Opcional: usuarios y créditos de ejemplo
npm run dev
```

API en `http://localhost:3001`

## Variables de Entorno

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `PORT` | Puerto (default: 3001) | — |
| `NODE_ENV` | `development` o `production` | — |
| `DATABASE_URL` | URL PostgreSQL | Neon, Supabase, o `postgresql://user:pass@localhost:5432/fya_credits` |
| `JWT_SECRET` | Clave para tokens JWT | String aleatorio seguro |
| `JWT_EXPIRES_IN` | Expiración (ej: `7d`) | — |
| `SENDGRID_API_KEY` | API Key SendGrid | [SendGrid → API Keys](https://app.sendgrid.com/settings/api_keys) |
| `EMAIL_FROM` | Remitente (debe estar verificado) | [SendGrid → Sender Auth](https://app.sendgrid.com/settings/sender_auth) |
| `EMAIL_TO` | Destino de notificaciones | Ej: `fyasocialcapital@gmail.com` |
| `REDIS_HOST` | Host Redis (default: localhost) | — |
| `REDIS_PORT` | Puerto Redis (default: 6379) | — |

### SendGrid

1. Cuenta en [sendgrid.com](https://sendgrid.com)
2. [API Keys](https://app.sendgrid.com/settings/api_keys) → Create → permisos Mail Send
3. [Sender Authentication](https://app.sendgrid.com/settings/sender_auth) → verificar el email de `EMAIL_FROM`

### Redis

Bull usa Redis para la cola de emails (reintentos, persistencia). Sin Redis, los emails se envían con `setImmediate` (sin cola).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo (tsx watch) |
| `npm run build` | Compilar |
| `npm start` | Producción |
| `npm run migrate` | Ejecutar migraciones |
| `npm run migrate:rollback` | Revertir última migración |
| `npm run seed` | Cargar datos de ejemplo |

## Estructura

```
src/
├── config/       # DB, env
├── middleware/   # auth, validation, errors
├── modules/
│   ├── auth/    # login, register
│   └── credits/ # CRUD créditos
├── jobs/        # Cola de emails (Bull)
├── utils/       # mailer (SendGrid)
├── app.ts
└── server.ts
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Registro
- `POST /api/auth/login` — Login (retorna JWT)

### Créditos (requieren `Authorization: Bearer <token>`)
- `POST /api/credits` — Crear crédito
- `GET /api/credits` — Listar con filtros

**Query params GET /api/credits:** `client_name`, `client_document`, `commercial_name`, `sort_by`, `sort_order`, `page`, `limit`

## Base de Datos

**users:** id, name, email, password, role, document, created_at, updated_at  
**credits:** id, client_id, credit_amount, interest_rate, term_months, registered_by, created_at, updated_at

Seeds: `admin@fyacredits.com`, `comercial1@fyacredits.com`, etc. — Password: `password123`
