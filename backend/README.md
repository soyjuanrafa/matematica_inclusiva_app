# Backend API - Cuenta Conmigo

API RESTful para la aplicación de matemáticas inclusivas "Cuenta Conmigo".

## 🚀 Tecnologías

- **Node.js** v18+
- **Express.js** v4.18+
- **PostgreSQL** v15+
- **Sequelize** v6.35+ (ORM)
- **JWT** para autenticación
- **bcrypt** para hashing de contraseñas

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/           # Configuraciones (DB, JWT)
│   ├── models/           # Modelos Sequelize
│   ├── controllers/      # Controladores de rutas
│   ├── services/         # Lógica de negocio
│   ├── middleware/       # Middleware personalizados
│   ├── routes/           # Definición de rutas
│   ├── validators/       # Schemas de validación (Joi)
│   └── app.js            # Configuración de Express
├── migrations/           # Migraciones de BD
├── seeders/              # Datos de prueba
├── tests/                # Tests
├── server.js             # Entry point
├── package.json
└── .env.example          # Variables de entorno de ejemplo
```

## 🛠️ Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Pasos

1. **Instalar dependencias**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```

   Editar `.env` con tus credenciales:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cuenta_conmigo_db
   DB_USER=postgres
   DB_PASSWORD=tu_password
   JWT_SECRET=tu_secreto_jwt_seguro
   PORT=3000
   ```

3. **Crear base de datos**
   ```bash
   # Conectarse a PostgreSQL
   psql -U postgres

   # Crear database
   CREATE DATABASE cuenta_conmigo_db;
   ```

4. **Ejecutar migraciones** (cuando estén creadas)
   ```bash
   npm run migrate
   ```

5. **Ejecutar seeders** (datos de prueba - opcional)
   ```bash
   npm run seed
   ```

6. **Iniciar servidor**
   ```bash
   # Desarrollo (con nodemon)
   npm run dev

   # Producción
   npm start
   ```

## 📡 Endpoints de la API

### Base URL
```
http://localhost:3000
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-16T12:00:00.000Z",
  "environment": "development"
}
```

---

### 🔐 Autenticación

#### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "name": "María García",
  "age": 8,
  "accessibility_preferences": {
    "textToSpeech": true,
    "highContrast": false
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "name": "María García",
      "age": 8,
      "avatar_url": null,
      "accessibility_preferences": {...},
      "created_at": "2025-10-16T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Obtener Perfil
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {...}
  }
}
```

---

### 📚 Lecciones

#### Obtener Todas las Lecciones
```http
GET /api/lessons?topic=suma&difficulty_level=1&limit=10&offset=0
```

**Query Parameters:**
- `topic` (opcional): Filtrar por tema (suma, resta, multiplicación, etc.)
- `difficulty_level` (opcional): Nivel 1-5
- `limit` (opcional): Cantidad de resultados (default: 50)
- `offset` (opcional): Paginación (default: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "lessons": [...],
    "total": 25,
    "limit": 10,
    "offset": 0
  }
}
```

#### Obtener Lección por ID
```http
GET /api/lessons/:id
Authorization: Bearer <token> (opcional)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": 1,
      "title": "Suma Básica 1-10",
      "description": "Aprende a sumar números del 1 al 10",
      "difficulty_level": 1,
      "topic": "suma",
      "content": {...},
      "order_index": 1,
      "is_active": true,
      "thumbnail_url": "...",
      "created_at": "..."
    },
    "progress": {
      "score": 85,
      "completed": true,
      "attempts": 2
    }
  }
}
```

#### Crear Lección (Admin)
```http
POST /api/lessons
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Nueva Lección",
  "description": "Descripción",
  "difficulty_level": 2,
  "topic": "multiplicacion",
  "content": {...},
  "order_index": 5
}
```

---

### 📊 Progreso

#### Obtener Progreso del Usuario
```http
GET /api/progress
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "id": 1,
        "user_id": 1,
        "lesson_id": 1,
        "score": 85,
        "attempts": 2,
        "completed": true,
        "completed_at": "...",
        "lesson": {
          "id": 1,
          "title": "Suma Básica 1-10",
          "topic": "suma",
          "difficulty_level": 1
        }
      }
    ],
    "stats": {
      "total_lessons_attempted": 5,
      "lessons_completed": 3,
      "average_score": 82,
      "total_time_spent": 1200
    }
  }
}
```

#### Crear/Actualizar Progreso
```http
POST /api/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "lesson_id": 1,
  "score": 95,
  "time_spent": 180
}
```

**Response (201 Created o 200 OK):**
```json
{
  "success": true,
  "message": "Progreso creado/actualizado",
  "data": {
    "progress": {...},
    "newRewards": [
      {
        "id": 1,
        "name": "Primera Lección Completada",
        "description": "...",
        "badge_image_url": "..."
      }
    ]
  }
}
```

#### Obtener Progreso de Lección Específica
```http
GET /api/progress/lesson/:lessonId
Authorization: Bearer <token>
```

---

## 🔒 Autenticación JWT

Todas las rutas privadas requieren un token JWT en el header:

```http
Authorization: Bearer <tu_token_jwt>
```

El token se obtiene al registrarse o iniciar sesión y expira en 24 horas (configurable).

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage
```

## 📝 Scripts Disponibles

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest --coverage",
  "migrate": "sequelize-cli db:migrate",
  "migrate:undo": "sequelize-cli db:migrate:undo",
  "seed": "sequelize-cli db:seed:all",
  "seed:undo": "sequelize-cli db:seed:undo:all"
}
```

## 🐛 Debugging

### Logs
Los logs se imprimen en consola con diferentes niveles según el entorno:
- **Development**: Logs detallados con `morgan('dev')`
- **Production**: Logs combinados con `morgan('combined')`

### Errores Comunes

**Error: Connection refused (ECONNREFUSED)**
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `.env`

**Error: JWT malformed**
- El token no tiene el formato correcto
- Verifica que estés enviando: `Bearer <token>`

**Error: Token expired**
- El token ha expirado (24h por defecto)
- El usuario debe iniciar sesión nuevamente

## 🚀 Deployment

### Variables de Entorno de Producción

```env
NODE_ENV=production
PORT=3000
DB_HOST=<tu_host_produccion>
DB_NAME=<tu_db_produccion>
DB_USER=<tu_usuario>
DB_PASSWORD=<tu_password>
JWT_SECRET=<secreto_seguro_aleatorio>
ALLOWED_ORIGINS=https://tu-app.com,https://www.tu-app.com
```

### Pasos de Deployment

1. Configurar variables de entorno
2. Ejecutar migraciones: `npm run migrate`
3. Iniciar servidor: `npm start`

### Plataformas Recomendadas
- **Heroku**: Deploy fácil con Git
- **Railway**: Moderno, excelente DX
- **DigitalOcean**: VPS con control total
- **AWS EC2/RDS**: Escalable para producción

## 📚 Documentación Adicional

- [Diagrama de Base de Datos](../docs/DIAGRAMA_BASE_DATOS.md)
- [Arquitectura de Software](../docs/ARQUITECTURA_SOFTWARE.md)
- [Tecnologías Seleccionadas](../docs/TECNOLOGIAS_SELECCIONADAS.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crea un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](../LICENSE)

---

**Desarrollado con ❤️ por el equipo de Cuenta Conmigo**
