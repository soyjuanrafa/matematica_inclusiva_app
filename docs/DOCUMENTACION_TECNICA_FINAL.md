# 📚 DOCUMENTACIÓN TÉCNICA FINAL - CUENTA CONMIGO

## 🏗️ ARQUITECTURA DE LA APLICACIÓN

### Arquitectura de 3 Capas

```
┌─────────────────┐
│   PRESENTACIÓN  │ ← Frontend (React/Flutter)
├─────────────────┤
│   NEGOCIO       │ ← Backend (Node.js/Express)
├─────────────────┤
│   DATOS         │ ← PostgreSQL + Redis Cache
└─────────────────┘
```

### Arquitectura Técnica Detallada

```
Frontend (React/Flutter)
    ↓ HTTPS/REST API
Backend (Node.js + Express)
├── Middleware de Seguridad
├── Controladores de API
├── Servicios Optimizados
├── Integración APIs Externas
└── Gestión de Base de Datos
    ↓ PostgreSQL Connection Pool
Base de Datos (PostgreSQL)
├── Tabla: users
├── Tabla: lessons
├── Tabla: lesson_progress
├── Tabla: achievements
└── Tabla: user_achievements
```

---

## 📊 ESQUEMA DE BASE DE DATOS

### Tabla: users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(20) DEFAULT 'user'
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### Tabla: lessons
```sql
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('facil', 'medio', 'dificil')),
    points INTEGER DEFAULT 10,
    estimated_time INTEGER, -- en minutos
    content JSONB, -- contenido estructurado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Índices
CREATE INDEX idx_lessons_category ON lessons(category);
CREATE INDEX idx_lessons_difficulty ON lessons(difficulty);
CREATE INDEX idx_lessons_active ON lessons(is_active);
CREATE INDEX idx_lessons_title_gin ON lessons USING gin(to_tsvector('spanish', title));
CREATE INDEX idx_lessons_description_gin ON lessons USING gin(to_tsvector('spanish', description));
```

### Tabla: lesson_progress
```sql
CREATE TABLE lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    score DECIMAL(5,2),
    points INTEGER,
    completed_at TIMESTAMP,
    time_spent INTEGER, -- en segundos
    attempts INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Índices
CREATE INDEX idx_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX idx_progress_completed_at ON lesson_progress(completed_at);
CREATE INDEX idx_progress_score ON lesson_progress(score DESC);
```

### Tabla: achievements
```sql
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    points INTEGER DEFAULT 0,
    criteria JSONB, -- criterios para desbloquear
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

### Tabla: user_achievements
```sql
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Índices
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);
```

---

## 🔗 ENDPOINTS DE LA API

### Autenticación
```
POST /api/auth/register
POST /api/auth/login
```

### Usuario
```
GET  /api/user/stats          - Estadísticas del usuario (autenticado)
GET  /api/user/streak         - Racha actual del usuario (autenticado)
GET  /api/user/achievements   - Logros del usuario (autenticado)
```

### Lecciones
```
GET  /api/lessons             - Lista de lecciones con paginación
GET  /api/lessons/:id         - Detalles de lección específica
GET  /api/lessons/search      - Búsqueda full-text de lecciones
POST /api/lessons/:id/progress - Registrar progreso en lección (autenticado)
```

### Leaderboard
```
GET  /api/leaderboard         - Ranking de usuarios con paginación
GET  /api/leaderboard/:period - Ranking por período (semanal/mensual)
```

### APIs Externas
```
POST /api/external/tts              - Text-to-Speech
POST /api/external/translate        - Traducción de texto
POST /api/external/moderate         - Moderación de contenido
POST /api/external/push             - Notificación push (autenticado)
POST /api/external/push/batch       - Notificaciones push masivas (autenticado)
POST /api/external/audio-lesson     - Crear lección con audio
GET  /api/external/health           - Health check de servicios externos
```

### Sistema
```
GET  /health                   - Health check general
GET  /api/cache/stats          - Estadísticas del cache
POST /api/admin/cache/clear    - Limpiar cache (admin)
```

---

## 🔒 MEDIDAS DE SEGURIDAD

### 1. Validación y Sanitización
- **Input validation**: Email, password, username con expresiones regulares
- **Sanitización XSS**: Middleware xss-clean
- **SQL Injection prevention**: Parameterized queries + mongo-sanitize
- **File upload validation**: Tipos MIME, tamaño máximo

### 2. Autenticación y Autorización
- **JWT tokens**: Expiración 7 días, refresh tokens opcional
- **Password hashing**: bcrypt con salt rounds = 12
- **Rate limiting**: 100 req/15min general, 5 req/15min login
- **Session management**: Invalidación automática

### 3. Headers de Seguridad
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  xssFilter: true,
}));
```

### 4. Logging y Monitoreo
- **Security logging**: Intentos sospechosos, rate limit violations
- **Request logging**: Método, path, IP, duración, código de respuesta
- **Error tracking**: Stack traces, contexto de error
- **Performance monitoring**: Response times, throughput

### 5. Protección contra Ataques Comunes
- **Rate limiting**: express-rate-limit
- **CORS**: Configurado para orígenes específicos
- **Helmet**: Headers de seguridad automáticos
- **hpp**: Parameter pollution prevention
- **Compression**: Gzip automático

### 6. Configuración de Producción
- **Environment variables**: Credenciales separadas
- **SSL/TLS**: Certificados Let's Encrypt
- **Database pooling**: Conexiones limitadas
- **Process management**: PM2 clustering

---

## ⚡ OPTIMIZACIÓN Y RENDIMIENTO

### Caching Strategy
```javascript
// Node-cache para datos frecuentes
const cache = new NodeCache({
  stdTTL: 300,        // 5 minutos TTL
  checkperiod: 60,    // Chequeo cada minuto
  maxKeys: 1000       // Máximo 1000 keys
});

// Estrategias de cache:
// - User stats: 5 min
// - Leaderboard: 2 min
// - Lessons list: 10 min
// - Search results: 5 min
```

### Query Optimization
```sql
-- Query con índices optimizados
EXPLAIN ANALYZE
SELECT u.username, SUM(lp.points) as total_points,
       RANK() OVER (ORDER BY SUM(lp.points) DESC) as rank
FROM users u
LEFT JOIN lesson_progress lp ON u.id = lp.user_id
WHERE lp.completed_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.id, u.username
ORDER BY total_points DESC
LIMIT 50;

-- Resultado esperado: < 200ms
```

### Database Indexing Strategy
```sql
-- Índices compuestos para queries complejas
CREATE INDEX idx_progress_user_completed ON lesson_progress(user_id, completed_at DESC);
CREATE INDEX idx_progress_score_rank ON lesson_progress(score DESC, completed_at DESC);

-- Partial indexes para datos activos
CREATE INDEX idx_active_lessons ON lessons(title, category) WHERE is_active = true;

-- GIN indexes para full-text search
CREATE INDEX idx_lessons_search ON lessons USING gin(to_tsvector('spanish', title || ' ' || description));
```

### Connection Pooling
```javascript
const pool = new Pool({
  max: 20,                    // Máximo 20 conexiones
  idleTimeoutMillis: 30000,   // Timeout idle 30s
  connectionTimeoutMillis: 2000, // Timeout conexión 2s
  allowExitOnIdle: true
});
```

### Response Compression
```javascript
app.use(compression({
  level: 6,        // Nivel de compresión
  threshold: 1024, // Comprimir respuestas > 1KB
  filter: (req, res) => {
    // No comprimir si ya está comprimido
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));
```

---

## 🌐 INTEGRACIÓN APIs EXTERNAS

### Text-to-Speech (TTS)
```javascript
// Google Cloud TTS (Premium)
const ttsRequest = {
  input: { text: "Hola mundo" },
  voice: { languageCode: 'es-ES', ssmlGender: 'FEMALE' },
  audioConfig: { audioEncoding: 'MP3' }
};

// VoiceRSS (Fallback gratuito)
const voiceRssUrl = `https://api.voicerss.org/?key=${apiKey}&src=${text}&hl=es-es&c=mp3`;
```

### Traducción
```javascript
// Google Translate API
const translation = await translate.translate(text, targetLanguage);

// LibreTranslate (Fallback)
const response = await axios.post('https://libretranslate.com/translate', {
  q: text,
  source: 'auto',
  target: targetLanguage
});
```

### Moderación de Contenido
```javascript
// Perspective API
const moderationRequest = {
  comment: { text: userContent },
  languages: ['es', 'en'],
  requestedAttributes: {
    TOXICITY: {},
    SEVERE_TOXICITY: {},
    IDENTITY_ATTACK: {},
    INSULT: {}
  }
};
```

### Push Notifications
```javascript
// Firebase Cloud Messaging
const message = {
  token: userToken,
  notification: { title, body },
  android: { priority: 'high' },
  apns: { payload: { aps: { sound: 'default' } } }
};
```

---

## 🧪 TESTING

### Estructura de Tests
```
backend/tests/
├── unit/           # Tests unitarios
│   ├── services/
│   ├── controllers/
│   └── middleware/
├── integration/    # Tests de integración
│   ├── api.test.js
│   └── database.test.js
├── e2e/           # Tests end-to-end
└── performance/   # Tests de rendimiento
```

### Coverage Report
```bash
# Ejecutar tests con coverage
npm run test:coverage

# Resultado esperado:
# Statements   : 85%
# Branches     : 80%
# Functions    : 90%
# Lines        : 85%
```

### Performance Tests
```javascript
// Artillery para load testing
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50

scenarios:
  - name: 'Health check'
    requests:
      - get:
          url: '/health'
```

---

## 🚀 DEPLOYMENT

### Configuración de Producción
```bash
# Variables de entorno críticas
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_production_secret
GOOGLE_APPLICATION_CREDENTIALS=/path/to/prod-credentials.json

# PM2 para process management
pm2 start app_improvements.js --name "cuenta-conmigo-api"
pm2 startup
pm2 save

# Nginx como reverse proxy
server {
    listen 80;
    server_name api.cuenta-conmigo.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Monitoreo
```javascript
// Health checks
app.get('/health/detailed', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: await checkDatabaseHealth(),
    cache: cache.getStats(),
    externalAPIs: await checkExternalAPIs()
  };
  res.json(health);
});
```

### Backup Strategy
```bash
# Backup diario de base de datos
pg_dump cuenta_conmigo_db > backup_$(date +%Y%m%d).sql

# Backup de archivos subidos
rsync -av /var/www/uploads/ /backup/uploads/

# Rotación de logs
logrotate -f /etc/logrotate.d/cuenta-conmigo
```

---

## 📈 MÉTRICAS Y MONITORING

### KPIs Principales
- **Response Time**: < 200ms para queries críticas
- **Uptime**: > 99.9%
- **Error Rate**: < 0.1%
- **Cache Hit Rate**: > 85%
- **Database Connection Pool**: Utilización < 80%

### Alertas
```javascript
// Alertas automáticas
const alerts = {
  highResponseTime: responseTime > 1000,
  highErrorRate: errorRate > 0.05,
  lowCacheHitRate: cacheHitRate < 0.7,
  databaseConnectionExhaustion: poolUsed > 15
};
```

### Logs
```javascript
// Winston para logging estructurado
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## 🔧 MANTENIMIENTO

### Tareas Diarias
- [ ] Revisar logs de errores
- [ ] Verificar estado de servicios externos
- [ ] Monitorear uso de recursos
- [ ] Backup de base de datos

### Tareas Semanales
- [ ] Actualizar dependencias
- [ ] Revisar métricas de rendimiento
- [ ] Limpiar cache si es necesario
- [ ] Verificar integridad de datos

### Tareas Mensuales
- [ ] Análisis de seguridad
- [ ] Optimización de queries
- [ ] Revisión de configuración
- [ ] Actualización de documentación

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Problemas Comunes

#### Error de Conexión a BD
```bash
# Verificar conexión
psql -h localhost -U username -d cuenta_conmigo_db

# Verificar variables de entorno
echo $DATABASE_URL

# Reiniciar pool de conexiones
pm2 restart cuenta-conmigo-api
```

#### Alto Uso de Memoria
```bash
# Verificar uso de memoria
pm2 monit

# Limpiar cache manualmente
curl -X POST http://localhost:3000/api/admin/cache/clear

# Reiniciar aplicación
pm2 restart cuenta-conmigo-api
```

#### APIs Externas Fallando
```bash
# Verificar health de APIs externas
curl http://localhost:3000/api/external/health

# Verificar credenciales
cat .env | grep -E "(GOOGLE|VOICERSS|FIREBASE)"

# Revisar logs de errores
tail -f logs/error.log | grep "external"
```

#### Lentitud en Queries
```bash
# Analizar query lenta
EXPLAIN ANALYZE SELECT * FROM lesson_progress WHERE user_id = 123;

# Verificar índices
SELECT * FROM pg_indexes WHERE tablename = 'lesson_progress';

# Reindexar si es necesario
REINDEX TABLE lesson_progress;
```

---

## 📞 CONTACTO Y SOPORTE

### Equipo de Desarrollo
- **Lead Developer**: [Nombre]
- **DevOps**: [Nombre]
- **QA**: [Nombre]

### Canales de Comunicación
- **Slack**: #cuenta-conmigo-dev
- **Email**: dev@cuenta-conmigo.com
- **Issues**: GitHub Issues
- **Wiki**: Confluence Internal

### Escalamiento de Incidentes
1. **P4**: Problema menor, resolver en 24h
2. **P3**: Problema moderado, resolver en 8h
3. **P2**: Problema importante, resolver en 4h
4. **P1**: Incidente crítico, resolver en 1h

---

*Documentación generada el: $(date)*
*Versión: 1.0.0*
*Última actualización: $(date)*
