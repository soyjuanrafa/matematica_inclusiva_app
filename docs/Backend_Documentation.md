# Documentación del Backend - Matemática Inclusiva App

## Resumen Ejecutivo

Esta documentación describe el backend de la aplicación "Matemática Inclusiva", una plataforma educativa diseñada para enseñar matemáticas de manera adaptativa e inclusiva. El backend está desarrollado en Node.js con Express.js, utilizando MongoDB en memoria para desarrollo y MongoDB para producción.

## Arquitectura del Sistema

### Tecnologías Utilizadas

- **Framework**: Node.js con Express.js
- **Base de Datos**: MongoDB (en memoria para desarrollo)
- **Autenticación**: JWT (JSON Web Tokens)
- **Encriptación**: bcryptjs para contraseñas
- **Validación**: Middleware personalizado
- **CORS**: Habilitado para desarrollo frontend

### Estructura del Proyecto

```
matematica_inclusiva_app/
├── config/
│   └── database.js          # Configuración de conexión a BD
├── models/
│   ├── User.js              # Modelo de Usuario
│   ├── Problem.js           # Modelo de Problema Matemático
│   └── Progress.js          # Modelo de Progreso
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── problems.js          # Rutas de problemas
│   └── progress.js          # Rutas de progreso
├── middleware/
│   └── auth.js              # Middleware de autenticación JWT
├── utils/
│   └── mathUtils.js         # Utilidades matemáticas
├── server.js                # Punto de entrada de la aplicación
├── package.json             # Dependencias y scripts
└── TODO.md                  # Lista de tareas completadas
```

## Modelos de Datos

### Usuario (User)

```javascript
{
  username: String (único, requerido),
  email: String (único, requerido),
  password: String (encriptado, requerido),
  level: String (enum: 'beginner', 'intermediate', 'advanced', default: 'beginner'),
  createdAt: Date,
  updatedAt: Date
}
```

### Problema (Problem)

```javascript
{
  problemText: String (ej: "7 × 5"),
  operation: String (enum: 'addition', 'subtraction', 'multiplication', 'division'),
  difficulty: String (enum: 'beginner', 'intermediate', 'advanced'),
  num1: Number,
  num2: Number,
  answer: Number,
  createdAt: Date
}
```

### Progreso (Progress)

```javascript
{
  user: ObjectId (referencia a User),
  problem: ObjectId (referencia a Problem),
  userAnswer: Number,
  isCorrect: Boolean,
  timeTaken: Number (milisegundos),
  createdAt: Date
}
```

## API Endpoints

### Autenticación (/api/auth)

#### POST /api/auth/register
Registra un nuevo usuario.

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login
Inicia sesión de usuario.

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

#### GET /api/auth/profile
Obtiene el perfil del usuario autenticado.

**Headers:** Authorization: Bearer {token}

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "level": "beginner"
  }
}
```

#### PUT /api/auth/level
Actualiza el nivel del usuario.

**Headers:** Authorization: Bearer {token}

**Request Body:**
```json
{
  "level": "intermediate"
}
```

### Problemas (/api/problems)

#### GET /api/problems/generate
Genera un nuevo problema matemático adaptado al nivel del usuario.

**Headers:** Authorization: Bearer {token}

**Response:**
```json
{
  "problem": {
    "id": "problem_id",
    "problemText": "7 × 5",
    "operation": "multiplication",
    "difficulty": "beginner"
  }
}
```

#### POST /api/problems/:id/answer
Envía la respuesta a un problema.

**Headers:** Authorization: Bearer {token}

**Request Body:**
```json
{
  "answer": 35,
  "timeTaken": 5000
}
```

**Response:**
```json
{
  "isCorrect": true,
  "correctAnswer": 35,
  "userLevel": "beginner",
  "message": "Correct!"
}
```

#### GET /api/problems/history
Obtiene el historial de problemas del usuario.

**Headers:** Authorization: Bearer {token}

**Query Parameters:**
- page (opcional): número de página
- limit (opcional): problemas por página

**Response:**
```json
{
  "problems": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### GET /api/problems/stats
Obtiene estadísticas del usuario.

**Headers:** Authorization: Bearer {token}

**Response:**
```json
{
  "totalProblems": 50,
  "correctAnswers": 40,
  "successRate": 80,
  "averageTime": 4500,
  "operationStats": [...],
  "currentLevel": "beginner"
}
```

### Progreso (/api/progress)

#### GET /api/progress/summary
Obtiene resumen del progreso del usuario.

**Headers:** Authorization: Bearer {token}

**Response:**
```json
{
  "summary": {
    "totalProblems": 50,
    "correctAnswers": 40,
    "successRate": 80,
    "currentStreak": 5,
    "longestStreak": 12
  },
  "recentProgress": [...]
}
```

#### GET /api/progress/timeline
Obtiene línea de tiempo del progreso.

**Headers:** Authorization: Bearer {token}

**Query Parameters:**
- days (opcional): días a incluir

**Response:**
```json
{
  "timeline": [
    {
      "date": "2025-10-16",
      "problemsSolved": 10,
      "correctAnswers": 8,
      "averageTime": 4200
    }
  ]
}
```

#### DELETE /api/progress/:id
Elimina un registro de progreso.

**Headers:** Authorization: Bearer {token}

## Lógica de Negocio

### Generación Adaptativa de Problemas

El sistema ajusta la dificultad de los problemas basándose en:

1. **Nivel actual del usuario**: beginner, intermediate, advanced
2. **Tasa de éxito**: Porcentaje de respuestas correctas
3. **Racha actual**: Número de respuestas correctas consecutivas

**Algoritmo de adaptación:**
- Si tasa de éxito > 80% y racha >= 5: aumentar dificultad
- Si tasa de éxito < 60%: disminuir dificultad
- Mantener dificultad si 60% <= tasa de éxito <= 80%

### Rangos de Dificultad

#### Beginner
- Addition/Subtraction: números 1-20
- Multiplication: números 1-10
- Division: números 1-10, resultados enteros

#### Intermediate
- Addition/Subtraction: números 1-100
- Multiplication: números 1-20
- Division: números 1-50, resultados enteros

#### Advanced
- Addition/Subtraction: números 1-1000
- Multiplication: números 1-50
- Division: números 1-100, con decimales

### Sistema de Niveles

- **Promoción**: Después de 5 respuestas correctas consecutivas
- **Retroceso**: Después de 3 respuestas incorrectas consecutivas
- **Mantenimiento**: Si el rendimiento es consistente

## Seguridad

### Autenticación JWT
- Tokens expiran en 7 días
- Refresh tokens no implementados (pueden agregarse)
- Contraseñas encriptadas con bcrypt (12 salt rounds)

### Validación de Datos
- Middleware de validación en todas las rutas
- Sanitización de inputs
- Verificación de tipos de datos

### CORS
- Configurado para desarrollo local
- Debe ajustarse para producción

## Configuración y Despliegue

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```
NODE_ENV=development
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here
MONGODB_URI=mongodb://localhost:27017/matematica_inclusiva
```

### Instalación

```bash
npm install
```

### Ejecución en Desarrollo

```bash
npm run dev  # Con nodemon para recarga automática
```

### Ejecución en Producción

```bash
npm start
```

### Base de Datos

Para desarrollo: MongoDB en memoria (no requiere instalación)
Para producción: MongoDB Atlas o instancia local

## Pruebas

### Endpoints Probados

1. **Health Check**: GET /api/health
   - Status: ✅ Funcionando

2. **Registro**: POST /api/auth/register
   - Status: ✅ Funcionando
   - Crea usuario y devuelve token JWT

3. **Login**: POST /api/auth/login
   - Status: ✅ Funcionando
   - Autentica usuario y devuelve token

4. **Generar Problema**: GET /api/problems/generate
   - Status: ✅ Funcionando
   - Genera problema adaptado al nivel del usuario

5. **Responder Problema**: POST /api/problems/:id/answer
   - Status: ✅ Funcionando
   - Valida respuesta y actualiza progreso

6. **Resumen de Progreso**: GET /api/progress/summary
   - Status: ✅ Funcionando
   - Muestra estadísticas y progreso reciente

## Consideraciones de Inclusividad

### Diseño Adaptativo
- Dificultad ajustable automáticamente
- Retroalimentación inmediata
- Progreso gradual

### Accesibilidad
- API RESTful clara y documentada
- Mensajes de error descriptivos
- Estructura de respuesta consistente

### Escalabilidad
- Arquitectura modular
- Separación de responsabilidades
- Fácil extensión de funcionalidades

## Próximos Pasos

1. **Frontend Integration**: Desarrollar interfaz de usuario
2. **Testing Suite**: Implementar pruebas unitarias y de integración
3. **Monitoring**: Agregar logging y monitoreo
4. **Deployment**: Configurar CI/CD y despliegue en la nube
5. **Additional Features**:
   - Modo offline
   - Compartir progreso
   - Leaderboards
   - Temas personalizados

## Conclusión

El backend de Matemática Inclusiva está completamente funcional y listo para integración con un frontend. La arquitectura es escalable, segura y diseñada específicamente para proporcionar una experiencia de aprendizaje matemático adaptativa e inclusiva.

---

**Fecha de Documentación**: Octubre 2025
**Versión**: 1.0.0
**Desarrollador**: BLACKBOXAI
