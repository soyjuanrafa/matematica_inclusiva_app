# 📗 Documentación Técnica – Tercera Fase (Hackathon Nicaragua 2025)
### Proyecto: Matemática Inclusiva “Cuenta Conmigo”

---

## 📘 Resumen del Proyecto

**Nombre:** Matemática Inclusiva “Cuenta Conmigo”  
**Propósito:** Aplicación móvil educativa accesible para estudiantes con diversas capacidades que enseña y practica matemáticas mediante lecciones, retroalimentación por voz y seguimiento de progreso.  
**Objetivo de la tercera fase:** Dejar el sistema listo para un despliegue inicial con arquitectura documentada, endpoints definidos, seguridad básica, pruebas automatizadas y guía de despliegue.

---

## 🔄 Cambios y mejoras en esta documentación

- Estructura clara orientada a equipos de desarrollo y operaciones.  
- Modelo de datos normalizado y relaciones explicadas.  
- Endpoints y flujos de autenticación detallados.  
- Recomendaciones de seguridad, pruebas y métricas.  
- Plan de despliegue paso a paso y opciones de escalado.  
- Hoja de ruta priorizada con próximas tareas.

---

## 🧩 Arquitectura general

### Diagrama lógico
**Interfaz móvil React Native con Expo → API REST Node.js + Express → ORM Sequelize → Base de datos PostgreSQL → Servicios externos (TTS, simplificación de texto, almacenamiento).**

### Capas y responsabilidades
- **Presentación:** React Native + Expo; accesibilidad, TTS local, UI responsiva.  
- **API:** Express.js; rutas, validación, manejo de errores.  
- **Servicios de negocio:** Integraciones con TTS y simplificación; lógica de progreso y recompensas.  
- **Persistencia:** PostgreSQL con migraciones y backups.  
- **Integraciones:** Adaptadores para TTS, simplificación, almacenamiento de archivos y analytics.

---

## 🧮 Modelo de datos

### Tablas principales

| Tabla | Descripción | Campos principales |
| ---- | ---- | ---- |
| users | Usuarios de la plataforma | id; name; email; password_hash; role; created_at |
| lessons | Lecciones y ejercicios | id; title; content; difficulty; metadata; created_at |
| progress | Avance por usuario y lección | id; user_id; lesson_id; score; attempts; updated_at |
| rewards | Recompensas y logros | id; name; description; criteria; created_at |
| user_rewards | Relación usuarios y recompensas | id; user_id; reward_id; awarded_at |

### Relaciones clave
- users **1:N** progress  
- lessons **1:N** progress  
- users **N:M** rewards via user_rewards

### Índices recomendados
- progress(user_id, lesson_id)  
- lessons(difficulty)

### Buenas prácticas de datos
- No almacenar texto sensible en claro.  
- Migraciones versionadas con Sequelize.  
- Backups diarios con política de retención definida.

---

## 🌐 API Endpoints

### Resumen principal

| Operación | Endpoint | Descripción |
| ---- | ---- | ---- |
| Registro | POST /auth/register | Crear nuevo usuario |
| Login | POST /auth/login | Autenticar y obtener JWT |
| Refrescar token | POST /auth/refresh | Obtener nuevo access token |
| Listar lecciones | GET /lessons | Obtener lecciones con paginación |
| Detalle lección | GET /lessons/:id | Obtener contenido completo |
| Registrar progreso | POST /progress | Guardar o actualizar progreso |
| Obtener progreso | GET /progress/:userId | Progreso por usuario |
| Reclamar recompensa | POST /rewards/claim | Asociar recompensa al usuario |

### Validaciones y protección
- Validar payloads con Joi o librería equivalente.  
- Rutas privadas protegidas por middleware JWT.  
- Verificación de roles para rutas administrativas.

### Flujo de autenticación recomendado
1. Usuario envía credenciales a `/auth/login`.  
2. Backend valida contraseña con bcrypt y responde con access token (JWT) y refresh token.  
3. Frontend guarda access token en almacenamiento seguro (Secure Store o equivalente).  
4. Middleware valida JWT en cada petición protegida.  
5. Implementar endpoint para revocar refresh tokens.

---

## 🔒 Seguridad y operaciones recomendadas

### Autenticación y sesiones
- JWT short-lived y refresh tokens revocables.  
- Mantener lista de revocación de refresh tokens en base de datos.

### Contraseñas y datos sensibles
- Hash con bcrypt y salt.  
- Encriptar campos sensibles si aplica.

### Protección de la API
- Rate limiting por IP y por usuario.  
- CORS restringido a dominios confiables.  
- Sanitización de entradas para evitar XSS e inyección SQL.

### Transporte y despliegue
- Forzar HTTPS en producción.  
- Variables de entorno gestionadas por el proveedor de despliegue.  
- Logging estructurado y monitorización de errores (Sentry u otro).

---

## 🌐 Integraciones externas

### Servicios sugeridos
- **TTS local:** Expo Speech API para pruebas; migrar a Google Cloud TTS o Azure TTS para producción.  
- **Servicio de simplificación de texto:** OpenAI o alternativa para crear versiones accesibles de lecciones.  
- **Almacenamiento de assets:** Amazon S3 o Cloud Storage.  
- **Analytics:** Firebase o alternativa de métricas.

### Buenas prácticas de integración
- Encapsular integraciones en adaptadores.  
- Cachear respuestas costosas (por ejemplo simplificaciones).  
- Control de costos y límites de uso.

---

## ⚡ Rendimiento y optimización

### Medidas inmediatas
- Paginación en endpoints con listas.  
- Crear índices para consultas frecuentes.  
- Middleware de compresión y caching HTTP cuando corresponda.

### Pasos siguientes
- Implementar caché distribuido con Redis.  
- Monitorizar tiempos de respuesta y establecer thresholds de alerta.  
- Profilear código Node.js para detectar cuellos de botella.

---

## 🧪 Pruebas y calidad

### Tipos de pruebas
- **Unitarias:** para lógica de negocio.  
- **Integración:** para endpoints con DB de pruebas.  
- **End-to-end:** para flujo crítico de la app.  
- **Seguridad:** escaneo automatizado (dependabot, npm audit).

### Herramientas recomendadas
- Jest y Supertest para API.  
- Detox o Appium para pruebas E2E en React Native.  
- GitHub Actions para CI que ejecute lint y pruebas en cada PR.

---

## ☁️ Plan de despliegue

### Fases
1. **Desarrollo local:** Node.js, Expo y PostgreSQL local.  
2. **Staging:** proveedor gestionado con base de datos separada.  
3. **Producción:** servicio gestionado y backups automáticos.  
4. **Escalado:** mediante contenedores y orquestador (Docker/Kubernetes).

### CI/CD
- Pipelines en GitHub Actions: lint, tests, build y despliegue automático a staging.  
- Merge a main solo desde PRs que pasen todas las checks.

### Backups y recuperación
- Backups automáticos diarios de PostgreSQL.  
- Pruebas periódicas de restauración.

---

## 🔧 Mantenimiento y operativa

### Tareas periódicas
- Revisar logs y alertas diariamente.  
- Mantener dependencias actualizadas y aplicar parches de seguridad.  
- Monitorizar uso de APIs externas y costos.

### Documentación viva
- Mantener README con comandos y badges.  
- Especificación OpenAPI/Swagger actualizada.  
- Runbook de despliegue en docs/deployment.md.

### Onboarding
- Checklist de setup local, variables de entorno y comandos comunes.

---

## 🧭 Hoja de ruta prioritaria

### Corto plazo (0–3 meses)
- Implementar refresh tokens y almacenamiento seguro en móvil.  
- Configurar CI/CD y pruebas E2E.  
- Desplegar entorno staging con backups automáticos.

### Mediano plazo (3–9 meses)
- Integrar servicio de simplificación de texto.  
- Mejorar calidad de TTS con voces naturales.  
- Publicar beta en Play Store mediante EAS Build.

### Largo plazo (9–18 meses)
- Evaluar migración a microservicios si la carga lo justifica.  
- Panel administrativo para docentes y métricas.  
- Internacionalización y soporte offline parcial.

---

## 🧭 Guía de instalación rápida

1. Clonar repositorio y moverse al directorio.  
2. Crear archivo `.env` con variables: `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY` (si aplica), `STORAGE_URL`.  
3. Ejecutar migraciones Sequelize: `npx sequelize db:migrate`.  
4. Instalar dependencias backend: `npm install`.  
5. Iniciar backend en desarrollo: `npm run dev`.  
6. Iniciar app Expo: `expo start`.  
7. Probar endpoints con Postman o colección incluida.

---

## 🔄 Contribuciones y flujo de trabajo

- Abrir issues con descripción y pasos para reproducir.  
- Usar ramas feature/ con PR hacia develop o main según flujo.  
- Requerir tests y revisiones de código para cambios significativos.  
- Documentar cambios importantes en `CHANGELOG.md`.

---

## 🗂 Archivos sugeridos en el repositorio

- `README.md` con resumen, comandos y badges.  
- `docs/architecture.md` con diagramas.  
- `docs/api.md` con OpenAPI.  
- `docs/deployment.md` con runbook y checklist.  
- `tests/` con suites unitarias e integración.  
- `.github/workflows/` con pipelines CI.

---

## 👥 Créditos y contacto

**Desarrollador principal:** Juan Rafael Cerna  
**Repositorio:** [https://github.com/soyjuanrafa/matematica_inclusiva_app](https://github.com/soyjuanrafa/matematica_inclusiva_app)

---

> Copia este archivo y pégalo en tu repositorio como **Documentacion_Tercera_Fase_Hackathon_Nicaragua_2025.md** para reemplazar la versión anterior.  
> Documento oficial del **Hackathon Nicaragua 2025 – Fase 3**.
