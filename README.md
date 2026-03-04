# Fya Credits API

Backend API para el sistema de gestión de créditos desarrollado con Express, TypeScript y PostgreSQL.

## Requisitos Previos

- Node.js 18+ 
- PostgreSQL 12+
- Redis (opcional): cola Bull para envío asíncrono de emails con reintentos. Sin Redis, los emails se envían directamente.

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales:
```env
# Server
PORT=3001
NODE_ENV=development

# Database (DATABASE_URL para Neon/cloud, o DB_* para local)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Email (SendGrid) — ver README principal para obtener API key
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_FROM=your-verified-email@domain.com
EMAIL_TO=fyasocialcapital@gmail.com

# Redis (cola Bull para emails; sin Redis se envían directamente)
REDIS_HOST=localhost
REDIS_PORT=6379
```

3. Crear la base de datos (solo si usas PostgreSQL local):
```bash
createdb fya_credits
```

4. Ejecutar migraciones:
```bash
npm run migrate
```

5. Ejecutar seeds (opcional, para datos de ejemplo):
```bash
npm run seed
```

**Nota:** Los seeds crean usuarios de ejemplo y créditos. Las credenciales de los usuarios son:
- Email: `admin@fyacredits.com`, `comercial1@fyacredits.com`, etc.
- Password: `password123` (para todos los usuarios de ejemplo)

## Ejecutar el proyecto

### Desarrollo
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### Producción
```bash
npm run build
npm start
```

## Estructura del Proyecto

```
fya-credits-api/
├── src/
│   ├── config/          # Configuración (DB, env)
│   ├── middleware/      # Middlewares (auth, validation, error handling)
│   ├── modules/         # Módulos de la aplicación
│   │   ├── auth/       # Autenticación
│   │   └── credits/    # Gestión de créditos
│   ├── jobs/           # Trabajos en segundo plano (emails)
│   ├── utils/          # Utilidades (mailer)
│   ├── app.ts          # Configuración de Express
│   └── server.ts       # Entry point
├── migrations/         # Migraciones de base de datos
├── seeds/             # Datos semilla
└── knexfile.ts        # Configuración de Knex
```

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Créditos

- `POST /api/credits` - Registrar nuevo crédito (requiere autenticación)
- `GET /api/credits` - Listar créditos con filtros (requiere autenticación)

**Query params para GET /api/credits:**
- `client_name` - Filtro por nombre del cliente
- `client_document` - Filtro por cédula/ID
- `commercial_name` - Filtro por comercial
- `sort_by` - Ordenar por: `created_at` o `credit_amount`
- `sort_order` - Orden: `asc` o `desc`
- `page` - Número de página (default: 1)
- `limit` - Resultados por página (default: 10)

## Características

- ✅ Autenticación JWT
- ✅ Validación de datos con Zod
- ✅ Envío de correos asíncrono con Bull
- ✅ Rate limiting
- ✅ Manejo de errores centralizado
- ✅ Migraciones y seeds con Knex
- ✅ TypeScript para type safety

## Notas sobre Email y Redis

**SendGrid**: El sistema usa SendGrid para enviar correos. Ver el README principal para obtener la API key y verificar el remitente.

**Redis**: Bull usa Redis como cola para enviar emails en segundo plano (reintentos automáticos, persistencia). Si Redis no está disponible, los emails se envían de inmediato con `setImmediate` (sin cola ni reintentos).
