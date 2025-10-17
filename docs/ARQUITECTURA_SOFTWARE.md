# Arquitectura de Software - Cuenta Conmigo

## Proyecto: Aplicación de Matemáticas Inclusivas
**Versión**: 1.0  
**Fecha**: Octubre 2025

---

## Índice
1. [Visión General](#visión-general)
2. [Patrón Arquitectónico](#patrón-arquitectónico)
3. [Diagrama de Arquitectura](#diagrama-de-arquitectura)
4. [Componentes del Sistema](#componentes-del-sistema)
5. [Flujo de Datos](#flujo-de-datos)
6. [Justificación de Decisiones](#justificación-de-decisiones)
7. [Consideraciones de Escalabilidad](#consideraciones-de-escalabilidad)

---

## Visión General

La aplicación "Cuenta Conmigo" implementa una **arquitectura cliente-servidor de tres capas** con separación clara de responsabilidades. El sistema está diseñado para ser escalable, mantenible y accesible, priorizando la experiencia de usuarios con diferentes capacidades.

### Principios Arquitectónicos
- **Separación de Responsabilidades**: Frontend, Backend y Base de Datos independientes
- **Stateless Backend**: API REST sin estado para escalabilidad horizontal
- **Mobile-First**: Diseño optimizado para dispositivos móviles
- **Accesibilidad**: Soporte integrado para text-to-speech y navegación adaptativa
- **Seguridad por Diseño**: Autenticación JWT, validación en múltiples capas

---

## Patrón Arquitectónico

### Arquitectura Principal: **Cliente-Servidor de 3 Capas**

```
┌──────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                      │
│                  (Frontend - React Native)                    │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │   Screens   │  │ Components  │  │   Navigation     │    │
│  │  (Vistas)   │  │ Reutilizables│ │   (Routing)      │    │
│  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘    │
│         │                │                    │               │
│         └────────────────┴────────────────────┘               │
│                          │                                    │
│         ┌────────────────▼────────────────────┐              │
│         │        Context API (Estado)         │              │
│         │  AuthContext | UserProgressContext  │              │
│         │        CharacterContext             │              │
│         └────────────────┬────────────────────┘              │
│                          │                                    │
│         ┌────────────────▼────────────────────┐              │
│         │       Services (API Calls)          │              │
│         │      apiService.js (Axios)          │              │
│         └────────────────┬────────────────────┘              │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ HTTP/HTTPS (REST API)
                           │ JSON Payloads
                           │ JWT Authentication
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     CAPA DE LÓGICA DE NEGOCIO                │
│                    (Backend - Node.js/Express)                │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │ Controllers  │  │  Middleware  │      │
│  │  /api/users  │  │ UserController│ │  authMiddleware│    │
│  │ /api/lessons │  │LessonController│ │validateMiddleware│  │
│  │/api/progress │  │ProgressController│ errorHandler │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                   │               │
│         └─────────────────┴───────────────────┘               │
│                          │                                    │
│         ┌────────────────▼────────────────────┐              │
│         │          Models (ORM)               │              │
│         │   User | Lesson | Progress | Reward │              │
│         │        Sequelize Models             │              │
│         └────────────────┬────────────────────┘              │
│                          │                                    │
│         ┌────────────────▼────────────────────┐              │
│         │      Business Logic Services        │              │
│         │  AuthService | ProgressService      │              │
│         │      ValidationService              │              │
│         └────────────────┬────────────────────┘              │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ SQL Queries
                           │ Transactions
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    CAPA DE PERSISTENCIA                       │
│                   (Base de Datos - PostgreSQL)                │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ lessons  │  │ progress │  │ rewards  │   │
│  │  table   │  │  table   │  │  table   │  │  table   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                  Foreign Keys & Indexes                      │
└──────────────────────────────────────────────────────────────┘
```

---

## Componentes del Sistema

### 1. Frontend (Capa de Presentación)

#### Patrón: **Component-Based Architecture con Context API**

**Estructura de Carpetas:**
```
src/
├── screens/              # Pantallas completas (páginas)
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── LessonScreen.js
│   ├── ProfileScreen.js
│   └── RewardsScreen.js
│
├── components/           # Componentes reutilizables
│   ├── AccessibleButton.js
│   ├── LessonCard.js
│   ├── NumericInputExercise.js
│   └── DragDropExercise.js
│
├── navigation/           # Configuración de navegación
│   └── AppNavigator.js   # Stack & Tab Navigator
│
├── context/              # Estado global (Context API)
│   ├── AuthContext.js        # Autenticación
│   ├── UserProgressContext.js # Progreso del usuario
│   └── CharacterContext.js   # Personaje seleccionado
│
├── services/             # Servicios de API
│   └── apiService.js     # Cliente Axios configurado
│
├── utils/                # Utilidades y helpers
│   ├── validators.js
│   └── accessibilityHelpers.js
│
└── theme.js              # Temas y constantes de diseño
```

**Responsabilidades:**
- Renderizado de UI y gestión de interacciones
- Validación de inputs en tiempo real
- Gestión de estado local con React Hooks
- Navegación entre pantallas
- Comunicación con backend via API REST
- Persistencia local con AsyncStorage (cache, tokens)
- Accesibilidad (text-to-speech, alto contraste)

**Tecnologías:**
- React Native 0.73.6
- Expo 50.0.0
- React Navigation 6
- Context API + Hooks
- AsyncStorage
- Axios

---

### 2. Backend (Capa de Lógica de Negocio)

#### Patrón: **MVC (Model-View-Controller) con Arquitectura en Capas**

**Estructura de Carpetas:**
```
backend/
├── src/
│   ├── config/           # Configuraciones
│   │   ├── database.js   # Config de PostgreSQL
│   │   └── jwt.js        # Config de JWT
│   │
│   ├── models/           # Modelos Sequelize (ORM)
│   │   ├── User.js
│   │   ├── Lesson.js
│   │   ├── Progress.js
│   │   └── Reward.js
│   │
│   ├── controllers/      # Controladores (lógica de endpoints)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── lessonController.js
│   │   ├── progressController.js
│   │   └── rewardController.js
│   │
│   ├── services/         # Lógica de negocio pura
│   │   ├── authService.js
│   │   ├── progressService.js
│   │   └── rewardService.js
│   │
│   ├── middleware/       # Middleware de Express
│   │   ├── authMiddleware.js    # Verificación JWT
│   │   ├── validationMiddleware.js # Validación de datos
│   │   └── errorHandler.js      # Manejo de errores global
│   │
│   ├── routes/           # Definición de rutas
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── progressRoutes.js
│   │   └── rewardRoutes.js
│   │
│   ├── validators/       # Schemas de validación
│   │   ├── userValidator.js
│   │   └── lessonValidator.js
│   │
│   └── app.js            # Configuración de Express
│
├── migrations/           # Migraciones de BD (Sequelize)
├── seeders/              # Datos iniciales
├── tests/                # Tests unitarios e integración
└── server.js             # Entry point del servidor
```

**Capas del Backend:**

1. **Capa de Rutas (Routes)**
   - Define endpoints REST (/api/users, /api/lessons, etc.)
   - Asocia HTTP methods (GET, POST, PUT, DELETE) a controladores
   - Aplica middleware de autenticación y validación

2. **Capa de Controladores (Controllers)**
   - Recibe requests HTTP
   - Valida y extrae datos de req.body, req.params, req.query
   - Llama a servicios de lógica de negocio
   - Devuelve responses HTTP con status codes apropiados

3. **Capa de Servicios (Services)**
   - Contiene lógica de negocio pura (independiente de HTTP)
   - Orquesta operaciones con múltiples modelos
   - Maneja transacciones complejas
   - Reutilizable desde diferentes controladores

4. **Capa de Modelos (Models)**
   - Define estructura de datos (tablas de BD)
   - Validaciones a nivel de modelo (constraints)
   - Relaciones entre entidades (foreign keys)
   - Métodos auxiliares (instance methods, class methods)

5. **Capa de Middleware**
   - Autenticación JWT (verifica tokens)
   - Validación de schemas (Joi/Yup)
   - Logging de requests
   - Manejo de errores global
   - CORS configuration

**Tecnologías:**
- Node.js 18+
- Express.js 4.18+
- Sequelize ORM 6.35+
- PostgreSQL Driver (pg)
- JWT (jsonwebtoken)
- bcrypt
- CORS
- dotenv

---

### 3. Base de Datos (Capa de Persistencia)

#### Patrón: **Modelo Relacional Normalizado (3NF)**

**Estructura de Tablas:**
```
users                     lessons                  progress
├── id (PK)              ├── id (PK)              ├── id (PK)
├── email (UNIQUE)       ├── title                ├── user_id (FK → users)
├── password_hash        ├── description          ├── lesson_id (FK → lessons)
├── name                 ├── difficulty_level     ├── score
├── age                  ├── content_json         ├── attempts
├── accessibility_prefs  ├── order_index          ├── completed_at
├── created_at           ├── created_at           ├── created_at
└── updated_at           └── updated_at           └── updated_at

rewards                   user_rewards
├── id (PK)              ├── id (PK)
├── name                 ├── user_id (FK → users)
├── description          ├── reward_id (FK → rewards)
├── badge_image_url      ├── earned_at
├── points_required      └── created_at
├── created_at
└── updated_at
```

**Relaciones:**
- **users 1:N progress**: Un usuario tiene muchos registros de progreso
- **lessons 1:N progress**: Una lección tiene muchos registros de progreso
- **users M:N rewards**: Usuarios pueden ganar múltiples recompensas (tabla intermedia user_rewards)

**Índices:**
- Primary Keys (id) en todas las tablas
- UNIQUE index en users.email
- Foreign Key indexes (user_id, lesson_id, reward_id)
- Composite index en (user_id, lesson_id) para progress

**Tecnología:**
- PostgreSQL 15+

---

## Flujo de Datos

### Ejemplo: Usuario Completa una Lección

```
┌─────────────────────────────────────────────────────────────────┐
│                           FLUJO COMPLETO                         │
└─────────────────────────────────────────────────────────────────┘

1. FRONTEND (LessonScreen.js)
   │
   ├─► Usuario responde ejercicio y presiona "Completar"
   │
   ├─► Component captura datos: { lessonId, score, timeSpent }
   │
   ├─► Llama a apiService.post('/api/progress', data)
   │
   └─► Muestra loading state

2. API SERVICE (apiService.js)
   │
   ├─► Agrega JWT token en Authorization header (interceptor)
   │
   ├─► Serializa data a JSON
   │
   ├─► Envía POST request a backend
   │
   └─► Espera response

3. BACKEND - MIDDLEWARE (authMiddleware.js)
   │
   ├─► Extrae token del header Authorization
   │
   ├─► Verifica y decodifica JWT
   │
   ├─► Agrega req.user = { id, email } para uso en controlador
   │
   └─► Llama a next() para continuar

4. BACKEND - VALIDACIÓN (validationMiddleware.js)
   │
   ├─► Valida schema de req.body con Joi/Yup
   │   { lessonId: required, score: 0-100, timeSpent: number }
   │
   ├─► Si falla: devuelve 400 Bad Request con errores
   │
   └─► Si pasa: llama a next()

5. BACKEND - CONTROLADOR (progressController.js)
   │
   ├─► Recibe request en createProgress(req, res, next)
   │
   ├─► Extrae datos: userId = req.user.id, body = req.body
   │
   ├─► Llama a progressService.createProgress(userId, body)
   │
   └─► Espera resultado del servicio

6. BACKEND - SERVICIO (progressService.js)
   │
   ├─► Verifica que lección existe (Lesson.findByPk)
   │
   ├─► Busca progreso previo (Progress.findOne({ userId, lessonId }))
   │
   ├─► Si existe: actualiza (update score, attempts++)
   │   Si no: crea nuevo (Progress.create)
   │
   ├─► Calcula si usuario ganó recompensa (checkRewardEligibility)
   │
   ├─► Si ganó recompensa: crea en UserReward (transacción)
   │
   └─► Devuelve { progress, newReward }

7. BACKEND - MODELO (Progress.js, UserReward.js)
   │
   ├─► Sequelize genera SQL:
   │   INSERT INTO progress (user_id, lesson_id, score, attempts)
   │   VALUES (1, 5, 85, 1)
   │   RETURNING *;
   │
   ├─► PostgreSQL ejecuta query
   │
   └─► Devuelve fila insertada

8. BASE DE DATOS (PostgreSQL)
   │
   ├─► Valida constraints (NOT NULL, foreign keys)
   │
   ├─► Inserta fila en tabla progress
   │
   ├─► Si hay recompensa: inserta en user_rewards (transacción)
   │
   └─► Commit transaction

9. BACKEND - CONTROLADOR (progressController.js)
   │
   ├─► Recibe resultado del servicio
   │
   ├─► Devuelve response:
   │   res.status(201).json({
   │     success: true,
   │     data: { progress, newReward }
   │   })
   │
   └─► Si error: pasa a errorHandler middleware

10. FRONTEND (LessonScreen.js)
    │
    ├─► Recibe response con status 201
    │
    ├─► Actualiza Context: UserProgressContext.addProgress(data)
    │
    ├─► Si hay newReward: muestra modal de celebración
    │
    ├─► Navega a LessonCompletionScreen con datos
    │
    └─► Persiste progreso localmente (AsyncStorage para offline)
```

---

## Justificación de Decisiones Arquitectónicas

### ¿Por qué Cliente-Servidor de 3 Capas?

**Ventajas:**
- ✅ **Separación clara**: Frontend y Backend independientes facilitan desarrollo paralelo
- ✅ **Escalabilidad**: Cada capa puede escalar horizontalmente de forma independiente
- ✅ **Mantenibilidad**: Cambios en UI no afectan lógica de negocio y viceversa
- ✅ **Reutilización**: Backend puede servir múltiples clientes (web, mobile, admin panel)
- ✅ **Seguridad**: Lógica crítica en backend protegido, frontend solo presenta datos
- ✅ **Testing**: Cada capa se puede probar en aislamiento

**Desventajas Consideradas:**
- ❌ Latencia de red entre capas (mitigado con cache)
- ❌ Mayor complejidad que monolito (justificado por beneficios)

**Alternativas Descartadas:**
- **Monolito**: No escala bien, acoplamiento alto
- **Microservicios**: Overhead excesivo para alcance actual (preparado para evolución)

---

### ¿Por qué MVC en Backend?

**Ventajas:**
- ✅ **Organización**: Código estructurado y fácil de navegar
- ✅ **Responsabilidad única**: Cada capa tiene un propósito claro
- ✅ **Testeable**: Controllers, Services y Models se pueden testear independientemente
- ✅ **Reutilización**: Services pueden ser usados por múltiples controllers
- ✅ **RESTful**: Se alinea perfectamente con diseño de API REST

**Implementación:**
- **Models**: Representan datos y relaciones (ORM Sequelize)
- **Controllers**: Manejan HTTP requests/responses (Express)
- **Services**: Contienen lógica de negocio pura (reutilizable)
- **Routes**: Definen endpoints y asocian a controllers

---

### ¿Por qué Context API en lugar de Redux?

**Ventajas:**
- ✅ **Sin dependencias**: Nativo de React, no requiere librerías extra
- ✅ **Simple**: Menos boilerplate que Redux
- ✅ **Suficiente**: Para complejidad actual no necesitamos Redux Toolkit
- ✅ **Hooks modernos**: useContext, useReducer para estado complejo
- ✅ **Rendimiento**: Para app móvil con pocos contextos es óptimo

**Cuándo migrar a Redux:**
- Si estado global crece significativamente (>5 contextos complejos)
- Si necesitamos time-travel debugging
- Si requerimos middleware avanzado (saga, thunk)

---

### ¿Por qué PostgreSQL sobre MongoDB?

**Ventajas:**
- ✅ **ACID**: Garantiza integridad de datos críticos (progreso, logros)
- ✅ **Relaciones**: Usuarios, lecciones, progreso y recompensas tienen relaciones claras
- ✅ **Transacciones**: Requerido para operaciones como "completar lección + ganar recompensa"
- ✅ **Validación**: Schema estricto evita datos inconsistentes
- ✅ **Migraciones**: Control de versiones del schema con Sequelize migrations
- ✅ **Escalabilidad**: Excelente rendimiento para queries relacionales

**MongoDB sería mejor si:**
- Datos altamente no estructurados
- Schema cambia frecuentemente
- Primariamente lecturas sin relaciones complejas

---

### ¿Por qué JWT para Autenticación?

**Ventajas:**
- ✅ **Stateless**: No requiere almacenar sesiones en servidor (escalable)
- ✅ **Mobile-friendly**: Fácil de almacenar en AsyncStorage
- ✅ **Performance**: No necesita consultas a BD para cada request
- ✅ **Auto-contenido**: Token incluye claims (id, email, rol)
- ✅ **Estándar**: RFC 7519, amplia adopción

**Implementación:**
```javascript
// Token incluye:
{
  userId: 123,
  email: "user@example.com",
  iat: 1698345600,  // issued at
  exp: 1698432000   // expires (24h)
}
```

---

## Consideraciones de Escalabilidad

### Escalabilidad Horizontal

#### Backend:
- **Load Balancer**: Múltiples instancias de Node.js detrás de NGINX/HAProxy
- **Stateless**: JWT permite distribuir requests sin sesiones compartidas
- **Contenedores**: Docker para deployment consistente
- **Kubernetes**: Orquestación para auto-scaling basado en carga

#### Base de Datos:
- **Read Replicas**: PostgreSQL replicas para queries de lectura (selects)
- **Connection Pooling**: PgBouncer para gestionar conexiones eficientemente
- **Índices**: Optimizados para queries frecuentes (user_id, lesson_id)
- **Partitioning**: Por fecha en tabla progress si crece mucho

### Cache y Rendimiento

#### Redis (Futuro):
```
├─► Cache de lecciones (raramente cambian)
├─► Cache de recompensas
├─► Leaderboards (sorted sets)
└─► Rate limiting para API
```

#### CDN para Assets:
- Imágenes de badges/recompensas
- Fuentes personalizadas
- Assets estáticos de lecciones

### Monitoreo y Observabilidad

#### Logging:
- **Winston/Pino**: Logs estructurados (JSON)
- **Centralizados**: ELK Stack o CloudWatch
- **Niveles**: ERROR, WARN, INFO, DEBUG

#### Métricas:
- **Prometheus**: Métricas de servidor (CPU, RAM, request rate)
- **Grafana**: Dashboards de monitoreo
- **APM**: New Relic o Datadog para tracing

#### Alertas:
- Error rate > 5%
- Response time > 2s
- Database connection pool exhausted

---

## Evolución Futura: Microservicios

Si la aplicación crece significativamente, podríamos evolucionar a:

```
API Gateway (Kong/Nginx)
       │
       ├─► Auth Service (Autenticación JWT)
       ├─► User Service (Gestión de usuarios)
       ├─► Lesson Service (Contenido educativo)
       ├─► Progress Service (Seguimiento de progreso)
       ├─► Gamification Service (Recompensas, leaderboards)
       └─► Notification Service (Push notifications)
```

**Criterios para migrar:**
- >100k usuarios activos
- Equipos de desarrollo independientes por dominio
- Necesidad de escalar servicios específicos de forma independiente
- Complejidad justifica overhead de microservicios

---

## Patrones de Diseño Implementados

### Frontend:
- **Component Composition**: Componentes pequeños y reutilizables
- **Container/Presentational**: Lógica separada de presentación
- **Custom Hooks**: Encapsulación de lógica reutilizable
- **Higher-Order Components**: Para accesibilidad y auth

### Backend:
- **Repository Pattern**: Models abstraen acceso a datos
- **Service Layer**: Lógica de negocio separada de HTTP
- **Dependency Injection**: Services inyectados en controllers (facilita testing)
- **Factory Pattern**: Creación de instancias complejas (Users con preferencias)
- **Middleware Chain**: Pipeline de procesamiento de requests

---

## Seguridad por Capas

```
FRONTEND:
├─► Validación de inputs (previene envío de datos inválidos)
├─► Token JWT en AsyncStorage (encrypted storage)
└─► HTTPS enforced (react-native-config)

BACKEND:
├─► JWT verification middleware (evita acceso no autorizado)
├─► Input validation con Joi (previene injection attacks)
├─► bcrypt password hashing (nunca plaintext)
├─► CORS configurado (solo origins permitidos)
├─► Rate limiting (previene DoS)
├─► SQL injection prevention (Sequelize ORM parameterized queries)
└─► Helmet.js (security headers)

DATABASE:
├─► Role-based access (usuario con permisos limitados)
├─► SSL/TLS connections (encriptación en tránsito)
├─► Encrypted backups (datos en reposo)
└─► Regular security patches
```

---

## Conclusión

La arquitectura de **Cliente-Servidor de 3 Capas con MVC** seleccionada proporciona:

1. ✅ **Mantenibilidad**: Código organizado y fácil de navegar
2. ✅ **Escalabilidad**: Preparado para crecimiento horizontal
3. ✅ **Seguridad**: Múltiples capas de validación y autenticación
4. ✅ **Testabilidad**: Cada componente se puede probar en aislamiento
5. ✅ **Accesibilidad**: Arquitectura soporta features inclusivos nativamente
6. ✅ **Rendimiento**: Cache, índices y queries optimizadas
7. ✅ **Evolución**: Preparado para migrar a microservicios si es necesario

Esta arquitectura balancea **simplicidad actual** con **capacidad de crecimiento futuro**, ideal para un proyecto educativo que prioriza inclusión y calidad.

---

**Documento generado**: Octubre 2025  
**Última actualización**: 2025-10-16  
**Autor**: Equipo de Desarrollo Cuenta Conmigo
