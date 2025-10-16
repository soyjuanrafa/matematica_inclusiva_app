# API Reference - Matemática Inclusiva App

## Base URL
```
http://localhost:3000/api
```

## Autenticación
Todos los endpoints protegidos requieren header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
Registra un nuevo usuario.

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token"
}
```

### POST /auth/login
Inicia sesión.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt_token"
}
```

### GET /auth/profile
Obtiene perfil del usuario autenticado.

**Response (200):**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "level": "beginner|intermediate|advanced"
  }
}
```

---

## 🧮 Problems Endpoints

### GET /problems/generate
Genera un problema matemático adaptado.

**Response (200):**
```json
{
  "problem": {
    "id": "string",
    "problemText": "7 × 5",
    "operation": "multiplication",
    "difficulty": "beginner"
  }
}
```

### POST /problems/{id}/answer
Envía respuesta a un problema.

**Body:**
```json
{
  "answer": 35,
  "timeTaken": 5000
}
```

**Response (200):**
```json
{
  "isCorrect": true,
  "correctAnswer": 35,
  "userLevel": "beginner",
  "message": "Correct!"
}
```

### GET /problems/history
Historial de problemas.

**Query Params:**
- page (optional): number
- limit (optional): number

**Response (200):**
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

### GET /problems/stats
Estadísticas del usuario.

**Response (200):**
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

---

## 📊 Progress Endpoints

### GET /progress/summary
Resumen del progreso.

**Response (200):**
```json
{
  "summary": {
    "totalProblems": 1,
    "correctAnswers": 1,
    "successRate": 100,
    "currentStreak": 1,
    "longestStreak": 1
  },
  "recentProgress": [...]
}
```

### GET /progress/timeline
Línea de tiempo del progreso.

**Query Params:**
- days (optional): number

**Response (200):**
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

---

## 🏥 Health Check

### GET /health
Verifica estado del servidor.

**Response (200):**
```json
{
  "status": "OK",
  "message": "Backend is running"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error"
}
```

---

## Rate Limiting
- No implementado actualmente
- Recomendado para producción

## Versioning
- API v1 (sin prefijo de versión)
- Futuras versiones usarán `/v2/`

---

**Última actualización**: Octubre 2025
