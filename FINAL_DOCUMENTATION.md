# 📘 Documentación Final — Aplicación *Matemática Inclusiva “Cuenta Conmigo”*

## 🧩 Descripción general
**Matemática Inclusiva — “Cuenta Conmigo”** es una aplicación educativa accesible e inclusiva, diseñada para apoyar el aprendizaje de las matemáticas en personas con discapacidad visual y auditiva.  
El proyecto combina **tecnología móvil (React Native / Expo)** con un **backend sólido en Node.js / Express y PostgreSQL**, priorizando **accesibilidad, rendimiento y seguridad**.

---

## 🌐 Arquitectura del Sistema

### Estructura general
```
Frontend (React Native / Expo)
        ↓
Backend API (Node.js / Express)
        ↓
Base de Datos (PostgreSQL)
```

### Descripción de componentes
| Componente | Descripción | Tecnologías |
|-------------|-------------|--------------|
| **Frontend** | Interfaz móvil accesible, responsive y moderna. | React Native (Expo), Axios, Styled Components, Expo Speech |
| **Backend** | API REST para autenticación, manejo de usuarios, lecciones y progreso. | Node.js, Express.js, Sequelize ORM |
| **Base de Datos** | Persistencia estructurada, con relaciones entre usuarios y progreso. | PostgreSQL |
| **Autenticación y sesiones** | Tokens JWT + bcrypt para hash de contraseñas. | JWT, bcrypt, Joi |
| **Seguridad adicional** | Helmet, CORS, validación de inputs. | Helmet, Joi, CORS |

---

## 🛠 Instalación y configuración

### Requisitos
- Node.js 18+  
- PostgreSQL 15+  
- Expo CLI  
- Editor de texto (VSCode recomendado)

### Pasos

#### 🔹 Clonar el proyecto
```bash
git clone https://github.com/soyjuanrafa/matematica_inclusiva_app.git
cd matematica_inclusiva_app
```

#### 🔹 Instalar dependencias (Frontend)
```bash
npm install
expo start
```

#### 🔹 Instalar dependencias (Backend)
```bash
cd backend
npm install
```

#### 🔹 Configurar variables de entorno
Copia el archivo `.env.example` y renómbralo a `.env`.  
Ejemplo de contenido:
```
DATABASE_URL=postgres://usuario:password@localhost:5432/matematica_inclusiva
JWT_SECRET=clave_super_segura
PORT=4000
```

#### 🔹 Crear base de datos
```bash
npx sequelize db:create
npx sequelize db:migrate
```

#### 🔹 Iniciar el servidor
```bash
npm start
```
El backend correrá en `http://localhost:4000`.

---

## 🧮 Base de Datos — Esquema principal

| Tabla | Campos principales | Descripción |
|--------|-------------------|--------------|
| **users** | id, name, email, password_hash, role | Datos de usuario |
| **lessons** | id, title, content, difficulty | Lecciones disponibles |
| **progress** | id, user_id, lesson_id, score, attempts | Seguimiento del aprendizaje |
| **rewards** | id, name, description | Sistema de recompensas |
| **user_rewards** | id, user_id, reward_id | Relación usuario-recompensa |

### Relaciones clave
- Un usuario tiene muchos progresos.  
- Una lección puede estar asociada a varios progresos.  
- Un usuario puede tener muchas recompensas.

---

## 🔐 Seguridad y Usabilidad

### Validaciones implementadas
- **Frontend**: validación de formularios, feedback visual y mensajes claros.  
- **Backend**: validación y sanitización de datos con **Joi**.  
- **Contraseñas**: hash con **bcrypt** (salt ≥10).  
- **Autenticación JWT**: tokens seguros con expiración de 1 hora.  
- **Helmet + CORS**: protección frente a ataques comunes.  
- **Errores controlados**: respuestas JSON con mensajes claros (sin trazas internas).

### Accesibilidad (UI/UX)
- Text-to-Speech integrado (`expo-speech`).  
- Colores con contraste adecuado (modo alto contraste).  
- Tipografía adaptable y botones grandes.  
- Diseño responsive para móvil, tablet y escritorio.

---

## ⚙️ Funcionalidades CRUD

| Función | Endpoint | Método | Descripción |
|----------|-----------|---------|--------------|
| Crear usuario | `/auth/register` | POST | Registra un nuevo usuario |
| Login | `/auth/login` | POST | Devuelve token JWT |
| Obtener lecciones | `/lessons` | GET | Lista las lecciones |
| Registrar progreso | `/progress` | POST | Guarda resultados del usuario |
| Editar progreso | `/progress/:id` | PUT | Actualiza el progreso |
| Eliminar progreso | `/progress/:id` | DELETE | Borra registro específico |

---

## 🚀 Optimización de rendimiento

- Consultas SQL optimizadas con **índices** en `user_id` y `lesson_id`.  
- Uso de **paginación** en listados grandes.  
- Evita consultas N+1 (uso de `include` en Sequelize).  
- **Frontend**: carga diferida de imágenes, memoización y uso moderado de estados.  
- **Backend**: middleware de compresión y logs optimizados con Morgan.

---

## 🧰 Integración con APIs externas

- **Expo Speech API**: usada para lectura en voz alta del contenido de las lecciones.  
- (Opcional para ampliación) Integración posible con API de Analytics (Firebase o Google Analytics) para métricas de uso.

---

## 🧠 Escalabilidad y Arquitectura Futura

1. **Microservicios**: separar el servicio de autenticación y el de lecciones.  
2. **Cache**: incorporar Redis para caching de consultas frecuentes.  
3. **Balanceo de carga**: uso de Nginx o AWS Load Balancer.  
4. **Contenedores**: migrar backend a Docker/Kubernetes.  
5. **CD/CI**: pipeline automatizado con GitHub Actions o Railway.  
6. **Escalabilidad vertical**: migrar a PostgreSQL en la nube (ej. AWS RDS).  
7. **Monitoreo**: logs centralizados y métricas (Datadog / Prometheus).

---

## 👤 Gestión de sesiones y autenticación

- **Login / Registro** → validación de usuario y creación de token JWT.  
- **AsyncStorage** (frontend) almacena token seguro.  
- **Interceptor Axios** → agrega encabezado `Authorization: Bearer <token>`.  
- **Middleware de autenticación** en backend verifica token en cada ruta protegida.  
- **Logout** → limpia token y redirige a pantalla de inicio.

---

## 📱 Evidencias de uso en distintos dispositivos

| Dispositivo | Evidencia |
|--------------|------------|
| **Desktop (Emulador Web)** | Captura de vista Home y login |
| **Tablet (Android)** | Captura de lección activa con texto ampliado |
| **Móvil (iOS)** | Grabación corta con TTS activo |
| **Backend Console** | Logs mostrando peticiones CRUD exitosas |

*(Adjuntar capturas y video demo en entrega final.)*

---

## 🎥 Video Demo — Guion (3 minutos máximo)

**Duración total:** 3:00 min  
**Formato:** grabación de pantalla + narración breve.

| Tiempo | Escena | Descripción |
|---------|---------|-------------|
| 0:00–0:15 | Inicio | Pantalla de bienvenida y descripción breve |
| 0:15–0:45 | Registro/Login | Creación de cuenta y acceso |
| 0:45–1:30 | Lección activa | Uso de TTS y accesibilidad |
| 1:30–2:10 | Registro de progreso | Ejemplo de guardado en DB |
| 2:10–2:45 | Perfil y recompensas | Visualización de logros |
| 2:45–3:00 | Cierre | Mostrar logs del backend y mensaje final |

**Consejo:** mantener resolución 720p, voz clara y subtítulos breves.

---

## 📘 Guía de Usuario Rápida

**1️⃣ Inicio rápido**
1. Instalar Expo Go (Android/iOS).  
2. Ejecutar `expo start` y escanear QR.  
3. Registrar usuario → iniciar sesión.  
4. Seleccionar una lección → escuchar o resolver ejercicios.  
5. Revisar tu progreso en la sección “Perfil”.

**2️⃣ Solución de problemas**
- Pantalla blanca → ejecutar `expo start -c`.  
- Error de login → verificar backend y `.env`.  
- Sin audio → revisar permisos del sistema.

---

## 🧾 Documentación de referencia
- [`ENTREGABLES_COMPLETADOS.md`](ENTREGABLES_COMPLETADOS.md)  
- [`DIAGRAMA_FLUJO_SISTEMA.md`](DIAGRAMA_FLUJO_SISTEMA.md)  
- `README.md` (guía técnica base y comandos de ejecución)

---

## 🧑‍💻 Autor
**Juan Rafael Cerna**  
Desarrollador principal, estudiante de Ingeniería en Sistemas  
Parroquia Santa Teresa del Niño Jesús — Proyecto con enfoque educativo e inclusivo.

---

> *“La educación inclusiva es el lenguaje del amor traducido en tecnología.”* 💙
