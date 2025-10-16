# Definición de Tecnologías Seleccionadas

## Proyecto: Cuenta Conmigo - Aplicación de Matemáticas Inclusivas

### Fecha: Octubre 2025
### Versión: 1.0

---

## 1. Lenguajes de Programación

### Frontend Mobile
- **Lenguaje Principal**: JavaScript/JSX (ES6+)
- **Justificación**: 
  - Compatibilidad nativa con React Native y ecosistema Expo
  - Gran comunidad de desarrolladores y recursos disponibles
  - Tipado dinámico que acelera el desarrollo de prototipos
  - Sintaxis moderna con características ES6+ (async/await, destructuring, arrow functions)
  - Amplia disponibilidad de librerías de accesibilidad

### Backend
- **Lenguaje Principal**: JavaScript (Node.js v18+)
- **Justificación**:
  - Stack completo en JavaScript facilita la transición entre frontend y backend
  - Excelente rendimiento para operaciones I/O intensivas (apropiado para APIs REST)
  - NPM ofrece un ecosistema robusto de paquetes
  - Facilita la reutilización de código y lógica de validación
  - Event-driven architecture ideal para aplicaciones en tiempo real

---

## 2. Frameworks y Librerías

### Frontend Mobile

#### React Native v0.73.6
- **Tipo**: Framework para desarrollo móvil multiplataforma
- **Justificación**:
  - Desarrollo simultáneo para iOS y Android con una única base de código
  - Rendimiento cercano a aplicaciones nativas
  - Hot reload acelera el ciclo de desarrollo
  - Componentes nativos para mejor experiencia de usuario
  - Excelente soporte para características de accesibilidad

#### Expo v50.0.0
- **Tipo**: Plataforma y herramienta de desarrollo para React Native
- **Justificación**:
  - Simplifica el desarrollo sin necesidad de Xcode o Android Studio
  - APIs nativas pre-configuradas (expo-speech, expo-av, expo-notifications)
  - Over-the-air updates para actualizaciones sin app store
  - Expo Go permite pruebas rápidas en dispositivos físicos
  - Documentación extensa y comunidad activa

#### React Navigation v6
- **Tipo**: Librería de navegación
- **Justificación**:
  - Navegación fluida con soporte para stack, tabs y drawer
  - Altamente personalizable y accesible
  - Integración perfecta con React Native
  - Soporte para deep linking
  - Gestión de estado de navegación integrada

#### Axios v1.12.2
- **Tipo**: Cliente HTTP
- **Justificación**:
  - API limpia y consistente para llamadas HTTP
  - Interceptores para manejo centralizado de auth y errores
  - Soporte para cancelación de requests
  - Transformación automática de datos JSON
  - Compatible con promesas y async/await

#### AsyncStorage
- **Tipo**: Almacenamiento local persistente
- **Justificación**:
  - Almacenamiento key-value asíncrono y persistente
  - API simple y consistente
  - Ideal para datos de usuario, preferencias y cache
  - Funciona tanto en iOS como Android
  - No requiere configuración adicional

### Backend

#### Express.js v4.18+
- **Tipo**: Framework web minimalista para Node.js
- **Justificación**:
  - Framework maduro y probado en producción
  - Middleware system flexible y extensible
  - Excelente para crear APIs RESTful
  - Gran ecosistema de plugins y middleware
  - Documentación completa y comunidad amplia
  - Fácil integración con bases de datos

#### Sequelize v6.35+
- **Tipo**: ORM (Object-Relational Mapping)
- **Justificación**:
  - Abstracción de base de datos con soporte multi-dialecto
  - Migrations para control de versiones del schema
  - Validaciones a nivel de modelo
  - Relaciones complejas simplificadas
  - Prevención de SQL injection por defecto
  - Queries optimizadas y transacciones

#### JWT (jsonwebtoken) v9.0+
- **Tipo**: Librería de autenticación
- **Justificación**:
  - Autenticación stateless ideal para APIs REST
  - Tokens seguros y auto-contenidos
  - Expiración automática configurable
  - No requiere almacenamiento en servidor
  - Estándar de industria (RFC 7519)

#### bcrypt v5.1+
- **Tipo**: Librería de hashing de contraseñas
- **Justificación**:
  - Hashing robusto y seguro para contraseñas
  - Protección contra ataques de rainbow tables
  - Salt rounds configurables para mayor seguridad
  - Resistente a ataques de fuerza bruta
  - Librería madura y auditada

#### CORS (cors) v2.8+
- **Tipo**: Middleware de seguridad
- **Justificación**:
  - Permite solicitudes cross-origin seguras
  - Configurable por origen, métodos y headers
  - Esencial para desarrollo frontend/backend separado
  - Prevención de ataques CSRF

---

## 3. Gestor de Base de Datos

### PostgreSQL v15+
- **Tipo**: Sistema de gestión de base de datos relacional
- **Justificación**:
  - **ACID Compliant**: Garantiza integridad de datos críticos (progreso de usuarios, logros)
  - **Relaciones Complejas**: Soporte excelente para foreign keys, joins y transacciones
  - **Escalabilidad**: Maneja crecimiento de usuarios y datos sin degradación
  - **JSON Support**: Permite almacenar datos semi-estructurados (configuraciones personalizadas)
  - **Open Source**: Sin costos de licencia, comunidad activa
  - **Extensiones**: PostGIS para geolocalización futura, pg_trgm para búsqueda de texto
  - **Seguridad**: Row-level security, roles y permisos granulares
  - **Rendimiento**: Índices B-tree, GiST, GIN para queries complejas optimizadas

#### Alternativa Considerada: MySQL
- **Descartada**: Menor soporte para JSON, características avanzadas limitadas, gestión de transacciones menos robusta

---

## 4. Sistema Operativo

### Desarrollo
- **SO Principal**: Ubuntu 22.04 LTS / macOS Monterey+ / Windows 11
- **Justificación**:
  - **Ubuntu**: Entorno Linux estable, excelente para desarrollo backend y contenedores
  - **macOS**: Necesario para desarrollo y testing en iOS
  - **Windows**: Amplio uso en entornos educativos, soporte para WSL2
  - Compatibilidad con Docker y herramientas de desarrollo modernas
  - Node.js y React Native funcionan nativamente en todos

### Producción (Backend)
- **SO**: Linux (Ubuntu Server 22.04 LTS)
- **Justificación**:
  - **Estabilidad**: LTS garantiza soporte extendido (5 años)
  - **Rendimiento**: Menor overhead que Windows Server
  - **Seguridad**: Parches regulares, comunidad activa en seguridad
  - **Costo**: Open source, sin licencias
  - **Ecosistema**: Mejor soporte para Node.js, PostgreSQL y Docker
  - **DevOps**: Amplia compatibilidad con herramientas CI/CD
  - **Recursos**: Menor consumo de RAM y CPU

### Contenedores
- **Docker**: Para aislamiento y portabilidad del backend
- **Justificación**:
  - Entornos consistentes entre desarrollo y producción
  - Fácil despliegue y escalamiento
  - Versionado de infraestructura como código

---

## 5. Herramientas de Desarrollo

### Control de Versiones
- **Git v2.40+**: Control de versiones distribuido
- **GitHub**: Repositorio remoto, CI/CD, issues, projects
- **Justificación**: Estándar de industria, colaboración eficiente, historial completo

### Gestión de Paquetes
- **npm v9+**: Gestor de paquetes para JavaScript
- **Justificación**: Integrado con Node.js, registry extenso, scripts personalizados

### Entorno de Desarrollo
- **Visual Studio Code**: Editor de código
- **Extensiones clave**:
  - ESLint: Linting de código
  - Prettier: Formateo automático
  - React Native Tools: Debugging y snippets
  - PostgreSQL Explorer: Gestión de BD
- **Justificación**: Ligero, extensible, excelente para JavaScript/React

### Testing
- **Jest**: Framework de testing para JavaScript
- **React Native Testing Library**: Testing de componentes
- **Supertest**: Testing de APIs REST
- **Justificación**: Integrados con React Native, sintaxis simple, mocking robusto

---

## 6. APIs y Servicios

### Text-to-Speech
- **Expo Speech API**
- **Justificación**: Integración nativa, soporte multiidioma, offline capability

### Notificaciones
- **Expo Notifications API**
- **Justificación**: Push notifications multiplataforma, scheduling local

### Fuentes Accesibles
- **Atkinson Hyperlegible**: Fuente diseñada para baja visión
- **Fredoka & Poppins**: Fuentes amigables para niños
- **Justificación**: Legibilidad, inclusión, experiencia de usuario

---

## 7. Arquitectura y Patrones

### Patrón de Arquitectura
- **Cliente-Servidor con MVC en Backend**
- **Context API + Custom Hooks en Frontend**
- **Justificación**: Detallada en documento ARQUITECTURA_SOFTWARE.md

### Manejo de Estado
- **React Context API**
- **Justificación**: 
  - Sin dependencias adicionales
  - Suficiente para complejidad actual
  - Evita prop drilling
  - Fácil de entender y mantener

---

## 8. Seguridad

### Autenticación
- **JWT (JSON Web Tokens)**: Tokens seguros con expiración
- **bcrypt**: Hashing de contraseñas con salt

### Validación
- **Validator.js**: Validación de inputs (email, strings)
- **Joi / Yup**: Schemas de validación para requests

### HTTPS
- **Let's Encrypt**: Certificados SSL gratuitos en producción
- **Justificación**: Encriptación de datos en tránsito, trust del usuario

---

## 9. Despliegue y DevOps

### Backend
- **Heroku / Railway / DigitalOcean**: Hosting del servidor Node.js
- **Justificación**: 
  - Heroku: Free tier, fácil despliegue con Git
  - Railway: Moderno, excelente DX, soporte PostgreSQL
  - DigitalOcean: Control total, pricing predecible

### Base de Datos
- **PostgreSQL Managed Service** (Heroku Postgres, Railway, o Supabase)
- **Justificación**: Backups automáticos, escalabilidad, mantenimiento reducido

### App Mobile
- **Expo Application Services (EAS)**
- **Justificación**: Builds nativos en la nube, OTA updates, no requiere macOS para iOS

### CI/CD
- **GitHub Actions**: Pipelines de integración continua
- **Justificación**: Integrado con GitHub, free para repos públicos, configuración YAML

---

## 10. Documentación y Colaboración

### Documentación
- **Markdown**: README, guías, documentación técnica
- **JSDoc**: Documentación en código JavaScript
- **Swagger/OpenAPI**: Documentación interactiva de API REST
- **Justificación**: Estándares de industria, legibles, versionables con Git

### Gestión de Tareas
- **GitHub Projects**: Tablero Kanban integrado
- **GitHub Issues**: Tracking de bugs y features
- **Justificación**: Integración perfecta con código, colaboración centralizada

---

## Resumen de Stack Tecnológico

```
┌─────────────────────────────────────────────────┐
│              MOBILE APP (Cliente)                │
│                                                  │
│  React Native + Expo + React Navigation         │
│  Context API + AsyncStorage + Axios             │
│  expo-speech + expo-notifications               │
└─────────────────┬───────────────────────────────┘
                  │ HTTP/REST API (JSON)
                  │ JWT Authentication
┌─────────────────▼───────────────────────────────┐
│              BACKEND (Servidor)                  │
│                                                  │
│  Node.js + Express.js + Sequelize ORM           │
│  JWT + bcrypt + CORS + Validator                │
└─────────────────┬───────────────────────────────┘
                  │ SQL Queries
┌─────────────────▼───────────────────────────────┐
│            BASE DE DATOS                         │
│                                                  │
│         PostgreSQL 15+ (ACID)                    │
│  Tablas: users, lessons, progress, rewards      │
└──────────────────────────────────────────────────┘

DESARROLLO:              PRODUCCIÓN:
├─ Ubuntu/macOS/Win11    ├─ Ubuntu Server 22.04 LTS
├─ VS Code + ESLint      ├─ Docker Containers
├─ Git + GitHub          ├─ Heroku/Railway/DO
└─ Jest + Testing Lib    └─ PostgreSQL Managed Service
```

---

## Conclusión

Este stack tecnológico fue seleccionado priorizando:

1. **Accesibilidad**: Expo Speech, fuentes legibles, APIs inclusivas
2. **Escalabilidad**: PostgreSQL, arquitectura modular, microservicios preparados
3. **Seguridad**: JWT, bcrypt, HTTPS, validaciones robustas
4. **Productividad**: Stack unificado JavaScript, herramientas maduras, hot reload
5. **Costo-Efectividad**: Tecnologías open source, tiers gratuitos disponibles
6. **Mantenibilidad**: Código limpio, documentación, testing, CI/CD

La combinación de React Native/Expo para el frontend y Node.js/Express/PostgreSQL para el backend proporciona un ecosistema robusto, moderno y ampliamente soportado que permite desarrollar una aplicación educativa inclusiva de alta calidad.

---

**Documento generado**: Octubre 2025  
**Última actualización**: 2025-10-16  
**Autor**: Equipo de Desarrollo Cuenta Conmigo
