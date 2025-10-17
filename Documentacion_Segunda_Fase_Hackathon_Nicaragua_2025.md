# 📘 Documentación Técnica – Segunda Fase (Hackathon Nicaragua 2025)
### Proyecto: Matemática Inclusiva “Cuenta Conmigo”

---

## 🏆 Introducción

**Hackathon Nicaragua 2025 – Fase 2 (Desarrollo, Marketing y Diseño Gráfico)**  
**Equipo:** Matemática Inclusiva “Cuenta Conmigo”  
**Autor principal:** Juan Rafael Cerna  
**Categoría:** Desarrollo Aficionado / Avanzado  
**Repositorio oficial:** [github.com/soyjuanrafa/matematica_inclusiva_app](https://github.com/soyjuanrafa/matematica_inclusiva_app)

---

## 🌍 Visión general del proyecto

**Matemática Inclusiva “Cuenta Conmigo”** es una aplicación educativa e inclusiva desarrollada con el propósito de facilitar el aprendizaje de matemáticas a personas con discapacidad visual y auditiva.  
El enfoque principal de esta segunda fase es **consolidar la base técnica** (autenticación, seguridad, rendimiento, escalabilidad y documentación) y **demostrar la solidez del sistema** a través de evidencias funcionales, una guía de usuario y un video demostrativo.

La app se desarrolla con una arquitectura **cliente-servidor moderna**, **interfaz accesible** y **backend optimizado**. Todo el código y documentación se gestionan desde un repositorio público en GitHub.

---

## 🧩 Arquitectura del Sistema

### 🧠 Descripción técnica general
```
Frontend (React Native / Expo)
        ↓
Backend API (Node.js / Express)
        ↓
Base de Datos (PostgreSQL)
```

### 📚 Justificación de elección tecnológica
| Componente | Tecnología | Justificación |
|-------------|-------------|----------------|
| **Lenguaje principal** | JavaScript (ES6) | Permite integración completa entre frontend y backend. |
| **Framework móvil** | React Native (Expo) | Desarrollo multiplataforma (Android, iOS, Web) con soporte de accesibilidad. |
| **Servidor** | Node.js + Express | Rendimiento, escalabilidad y facilidad para APIs RESTful. |
| **Base de Datos** | PostgreSQL | Robusta, relacional, escalable y con buen soporte de seguridad. |
| **ORM** | Sequelize | Simplifica migraciones, validaciones y relaciones entre tablas. |
| **Autenticación** | JWT + bcrypt | Seguridad moderna para sesiones y contraseñas. |
| **UI/UX** | Styled Components + Expo Speech | Coherencia visual y accesibilidad auditiva. |

---

## 🧮 Base de Datos — Esquema y Relaciones

| Tabla | Campos principales | Descripción |
|--------|-------------------|--------------|
| **users** | id, name, email, password_hash, role | Información básica y autenticación de usuarios |
| **lessons** | id, title, content, difficulty | Contenido de las lecciones interactivas |
| **progress** | id, user_id, lesson_id, score, attempts | Seguimiento del aprendizaje |
| **rewards** | id, name, description | Sistema de recompensas y gamificación |
| **user_rewards** | id, user_id, reward_id | Relación usuario-recompensa |

**Relaciones:**  
- Un usuario puede tener varios progresos.  
- Una lección pertenece a múltiples usuarios.  
- Un usuario puede desbloquear varias recompensas.  

---

## 🔐 Gestión de sesiones y autenticación

### 1. Registro de usuario
- **Ruta:** `/auth/register`  
- **Método:** `POST`  
- **Validaciones:** email único, contraseña ≥ 8 caracteres, nombre obligatorio.  
- **Procesos:** hash de contraseña (bcrypt) → creación de registro → respuesta con token JWT.  

### 2. Inicio de sesión
- **Ruta:** `/auth/login`  
- **Método:** `POST`  
- **Flujo:** compara hash → genera JWT → devuelve token y perfil del usuario.

### 3. Middleware de autenticación
Protege las rutas sensibles (por ejemplo `/progress`, `/profile`) validando el token JWT en los headers.

### 4. Cierre de sesión
Frontend limpia token de `AsyncStorage` y redirige a pantalla de inicio.  

### 5. Seguridad adicional
- Token con expiración de 1 hora.  
- Sanitización de entradas con Joi.  
- Helmet y CORS configurados.  
- Encriptación de contraseñas con bcrypt y salt de 10.

---

## ⚙️ Escalabilidad y APIs

### 1. API externa integrada
La app utiliza **Expo Speech API** para convertir texto a voz, facilitando la accesibilidad auditiva.  
Esta API permite a los usuarios escuchar las lecciones, mejorando la inclusión de personas con discapacidad visual.

### 2. Escalabilidad del sistema
Para una futura versión en producción, el sistema puede escalar de la siguiente forma:

| Nivel | Estrategia | Descripción |
|--------|-------------|-------------|
| **Aplicativo** | Microservicios | Separar el módulo de autenticación del módulo de aprendizaje. |
| **Base de datos** | Sharding / Replica | PostgreSQL soporta replicación y consultas paralelas. |
| **Backend** | Balanceo de carga | Uso de Nginx o AWS Elastic Load Balancer. |
| **Frontend** | CDN + PWA | Desplegar el frontend como Progressive Web App. |
| **Infraestructura** | Contenedores | Docker y Kubernetes para despliegue escalable. |
| **Monitoreo** | Logs + Métricas | Integración con Datadog o Prometheus. |

---

## 🚀 Optimización y rendimiento

- Consultas SQL optimizadas con índices en `user_id` y `lesson_id`.  
- Middleware de compresión para reducir respuesta HTTP.  
- Cache de recursos estáticos (React Native).  
- Lazy Loading de imágenes y componentes.  
- Mecanismo de reintento en peticiones fallidas (Axios).  
- Manejo centralizado de errores con logs en servidor y alertas.  

---

## 🧰 Documentación Técnica Completa

### 🔹 Instalación

```bash
git clone https://github.com/soyjuanrafa/matematica_inclusiva_app.git
cd matematica_inclusiva_app
npm install
expo start
```

### 🔹 Configuración del backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Ejemplo `.env`:
```
DATABASE_URL=postgres://usuario:password@localhost:5432/matematica_inclusiva
JWT_SECRET=clave_segura_2025
PORT=4000
```

### 🔹 Dependencias principales
- express  
- sequelize  
- pg / pg-hstore  
- jsonwebtoken  
- bcrypt  
- joi  
- cors  
- helmet  

### 🔹 Endpoints principales
| Método | Ruta | Descripción |
|---------|------|-------------|
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Autenticación |
| GET | `/lessons` | Obtiene listado de lecciones |
| POST | `/progress` | Guarda progreso del usuario |
| PUT | `/progress/:id` | Actualiza progreso |
| DELETE | `/progress/:id` | Elimina progreso |

---

## 📱 Guía de Usuario Rápida

### Instalación móvil
1. Instalar Expo Go desde Play Store o App Store.  
2. Ejecutar `expo start` en la raíz del proyecto.  
3. Escanear el código QR con la app Expo Go.  

### Uso básico
1. **Registro/Login:** Crear cuenta o acceder con credenciales existentes.  
2. **Inicio:** Pantalla principal con lecciones disponibles.  
3. **Lección:** Escuchar con Text-to-Speech o resolver ejercicios interactivos.  
4. **Progreso:** Consultar estadísticas personales.  
5. **Perfil:** Editar datos o cerrar sesión.

### Soporte de accesibilidad
- Lectura por voz (Expo Speech).  
- Modo alto contraste.  
- Tamaño de texto ajustable.  
- Botones grandes y navegación simple.

---

## 🎥 Video Demo (Guion de 3 minutos)

**Duración total:** 3:00 minutos  
**Objetivo:** mostrar la accesibilidad, interacción y flujo completo.

| Tiempo | Escena | Descripción |
|---------|---------|-------------|
| 0:00–0:15 | Intro | Pantalla de bienvenida, logo y objetivo del proyecto. |
| 0:15–0:45 | Registro/Login | Registro nuevo usuario y login exitoso. |
| 0:45–1:30 | Lección activa | Ejemplo con lectura por voz y navegación táctil. |
| 1:30–2:10 | Progreso guardado | Mostrar estadísticas y log en consola del backend. |
| 2:10–2:45 | Perfil y cierre | Ajustes personales y cierre de sesión. |
| 2:45–3:00 | Créditos | Mostrar nombre del equipo y mensaje inclusivo. |

---

## 🔎 Evaluación de Seguridad y Usabilidad

### Seguridad
- Validaciones de input (longitud, formato, sanitización).  
- Tokens JWT cifrados con secreto único.  
- Control de errores y middleware de seguridad.  
- Helmet, CORS y HTTPS recomendados para producción.  

### Usabilidad
- Paleta de colores de alto contraste.  
- Íconos intuitivos.  
- Retroalimentación visual y auditiva.  
- Diseño coherente en pantallas móviles y tablets.  

---

## 🧠 Conclusiones

Esta segunda fase consolida el proyecto **“Matemática Inclusiva – Cuenta Conmigo”** como una propuesta **viable, funcional y escalable**.  
El sistema es estable, seguro y preparado para producción inicial, con autenticación JWT, arquitectura modular y un enfoque inclusivo.  

**Impacto social:**  
El proyecto representa una herramienta concreta de apoyo educativo para personas con discapacidad visual y auditiva, alineado con los Objetivos de Desarrollo Sostenible (ODS 4: Educación de Calidad).

---

## 👥 Créditos del Equipo
**Desarrollador Principal:** Juan Rafael Cerna  
**Colaboradores:** Comunidad Católica Santa Teresa del Niño Jesús  
**Mentor:** Fray Juan (inspiración espiritual y social del proyecto)  

**Hackathon Nicaragua 2025** – Fase 2  
**Proyecto: Matemática Inclusiva “Cuenta Conmigo”**  
© 2025 – Todos los derechos reservados.
