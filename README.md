# Cuenta Conmigo - App de Matemáticas Inclusivas

Una aplicación móvil educativa full-stack diseñada para enseñar matemáticas de manera inclusiva y accesible, especialmente para estudiantes con discapacidades.

## 🎯 Características Principales

### Operaciones CRUD Completas
- **Usuarios**: Crear, leer, actualizar y eliminar cuentas con autenticación JWT
- **Lecciones**: Gestión completa de contenido educativo con niveles de dificultad
- **Progreso**: Seguimiento y actualización del progreso del estudiante con estadísticas
- **Logros**: Sistema de recompensas con badges y gamificación

### ✅ Validación Robusta de Datos
- **Frontend**: Validación en tiempo real en formularios con feedback visual
- **Backend**: Validación con Joi en todos los endpoints
- **Database**: Constraints y validaciones a nivel de PostgreSQL
- Mensajes de error claros y accesibles en español

### 🌐 API RESTful Completa
- **Autenticación**: Login, registro y perfil con JWT
- **Lecciones**: CRUD completo con filtros y paginación
- **Progreso**: Tracking detallado con sincronización en tiempo real
- **Recompensas**: Sistema automático de logros
- Documentación completa en [Backend README](backend/README.md)

### 📱 Interfaz Móvil Completa (9 Pantallas)
1. **WelcomeScreen**: Onboarding inicial
2. **LoginScreen**: Autenticación con validación visual
3. **HomeScreen**: Dashboard interactivo con estadísticas
4. **LessonSelectionScreen**: Catálogo de lecciones con filtros
5. **LessonScreen**: Lecciones interactivas con feedback inmediato
6. **LessonCompletionScreen**: Resultados y estadísticas
7. **ProfileScreen**: Perfil personalizable con configuraciones
8. **RewardsScreen**: Visualización de logros y badges
9. **AccessibilitySettingsScreen**: Configuración de accesibilidad

### ♿ Accesibilidad Integral
- **Text-to-Speech**: Expo Speech integrado en todos los componentes
- **Alto Contraste**: Modo de alto contraste para baja visión
- **Fuentes Legibles**: Atkinson Hyperlegible, Fredoka, Poppins
- **Tamaños Ajustables**: Tres tamaños de fuente configurables
- Navegación accesible con labels y hints

### 📊 Sistema de Progreso y Gamificación
- Puntuación y estadísticas detalladas por lección
- Sistema de intentos y mejor score
- Recompensas automáticas basadas en logros
- Leaderboard de usuarios (próximamente)
- Racha diaria y seguimiento de tiempo

## 🛠️ Stack Tecnológico

### Frontend (Mobile)
- **Framework**: React Native 0.73.6 + Expo 50.0.0
- **Navegación**: React Navigation 6 (Stack + Tabs)
- **Estado**: Context API + Custom Hooks
- **HTTP Client**: Axios con interceptores
- **Persistencia**: AsyncStorage
- **Accesibilidad**: expo-speech, expo-av, expo-notifications
- **UI**: Styled Components, fuentes personalizadas

### Backend (API)
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Base de Datos**: PostgreSQL 15+
- **ORM**: Sequelize 6.35+
- **Autenticación**: JWT (jsonwebtoken 9.0+)
- **Seguridad**: bcrypt, helmet, CORS, rate-limiting
- **Validación**: Joi 17+
- **Logger**: Morgan

### Base de Datos
- **PostgreSQL 15+**: Base de datos relacional ACID
- **5 Tablas**: users, lessons, progress, rewards, user_rewards
- **Relaciones**: 1:N (users→progress), M:N (users↔rewards)
- **Índices**: Optimizados para queries frecuentes
- Scripts SQL completos en [Diagrama de BD](docs/DIAGRAMA_BASE_DATOS.md)

### DevOps
- **Control de Versiones**: Git + GitHub
- **Gestión de Tareas**: GitHub Projects + Issues
- **Testing**: Jest + React Native Testing Library
- **Deploy**: Expo EAS (mobile), Heroku/Railway (backend)

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm 9+
- PostgreSQL 15+
- Expo CLI (opcional): `npm install -g expo-cli`
- Git

### 1. Clonar Repositorio
```bash
git clone https://github.com/tu-usuario/cuenta-conmigo.git
cd cuenta-conmigo
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Crear base de datos
psql -U postgres -c "CREATE DATABASE cuenta_conmigo_db;"

# Ejecutar migraciones (cuando estén creadas)
npm run migrate

# Insertar datos de prueba
npm run seed

# Iniciar servidor
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### 3. Configurar Frontend

```bash
# Volver a la raíz del proyecto
cd ..

# Instalar dependencias
npm install

# Actualizar URL del backend en src/services/apiService.js
# Cambiar: baseURL: 'https://api.example.com'
# Por:     baseURL: 'http://localhost:3000'

# Iniciar app móvil
npm start
# o
expo start
```

Escanea el QR con Expo Go (Android) o Camera (iOS).

### 4. Verificar Instalación

**Backend:**
```bash
curl http://localhost:3000/health
# Debe retornar: {"success": true, "message": "API is running"}
```

**Frontend:**
- Abre la app en tu dispositivo
- Regístrate con email y contraseña
- Navega por las lecciones

## 📁 Estructura del Proyecto

```
cuenta-conmigo/
├── backend/                    # API REST con Node.js/Express
│   ├── src/
│   │   ├── config/            # Configuraciones (DB, JWT)
│   │   ├── models/            # Modelos Sequelize (ORM)
│   │   ├── controllers/       # Controladores de rutas
│   │   ├── services/          # Lógica de negocio
│   │   ├── middleware/        # Auth, validation, errorHandler
│   │   ├── routes/            # Definición de rutas API
│   │   ├── validators/        # Schemas de validación Joi
│   │   └── app.js             # Configuración Express
│   ├── migrations/            # Migraciones de BD
│   ├── seeders/               # Datos de prueba
│   ├── tests/                 # Tests backend
│   ├── server.js              # Entry point
│   ├── package.json
│   └── README.md              # Documentación backend
│
├── src/                       # Frontend React Native
│   ├── components/            # Componentes reutilizables
│   │   ├── AccessibleButton.js
│   │   ├── LessonCard.js
│   │   ├── NumericInputExercise.js
│   │   └── DragDropExercise.js
│   ├── screens/               # Pantallas completas (9 screens)
│   │   ├── WelcomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   └── ...
│   ├── context/               # Estado global Context API
│   │   ├── AuthContext.js
│   │   ├── UserProgressContext.js
│   │   └── CharacterContext.js
│   ├── navigation/            # React Navigation
│   │   └── AppNavigator.js
│   ├── services/              # API Client
│   │   └── apiService.js
│   ├── utils/                 # Utilidades
│   │   └── validators.js
│   └── theme.js               # Tema y constantes
│
├── docs/                      # Documentación completa
│   ├── TECNOLOGIAS_SELECCIONADAS.md    # Stack tecnológico
│   ├── ARQUITECTURA_SOFTWARE.md        # Arquitectura 3 capas
│   ├── DIAGRAMA_BASE_DATOS.md          # ERD y SQL scripts
│   ├── FRONTEND_ESTRUCTURA.md          # Documentación frontend
│   └── GESTION_TAREAS.md               # Tablero y workflow
│
├── assets/                    # Recursos (imágenes, fuentes)
├── package.json               # Dependencias frontend
├── app.json                   # Configuración Expo
├── .gitignore
└── README.md                  # Este archivo
```

## 📚 Documentación Completa

### Documentos Técnicos
- **[Tecnologías Seleccionadas](docs/TECNOLOGIAS_SELECCIONADAS.md)**: Stack completo con justificaciones
- **[Arquitectura de Software](docs/ARQUITECTURA_SOFTWARE.md)**: Diseño de 3 capas, MVC, diagramas
- **[Diagrama de Base de Datos](docs/DIAGRAMA_BASE_DATOS.md)**: ERD, tablas, relaciones, scripts SQL
- **[Estructura del Frontend](docs/FRONTEND_ESTRUCTURA.md)**: Componentes, Context API, navegación
- **[Backend API](backend/README.md)**: Documentación de endpoints, autenticación, ejemplos

### Gestión del Proyecto
- **[Gestión de Tareas](docs/GESTION_TAREAS.md)**: Workflow, GitHub Projects, convenciones
- **[Justificación del Sistema](JUSTIFICACION_DEL_SISTEMA.md)**: Propósito y objetivos
- **[Diagrama de Flujo](DIAGRAMA_FLUJO_SISTEMA.md)**: Flujos de usuario

## 🧪 Testing

### Backend
```bash
cd backend

# Tests unitarios
npm test

# Tests con coverage
npm test -- --coverage

# Tests de integración
npm run test:integration
```

### Frontend
```bash
# Tests de componentes
npm test

# Tests E2E (cuando estén configurados)
npm run test:e2e
```

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
cd backend

# Heroku
heroku create cuenta-conmigo-api
heroku addons:create heroku-postgresql:hobby-dev
git subtree push --prefix backend heroku main

# Railway
railway login
railway init
railway up
```

### Frontend (Expo EAS)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar build
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios

# Submit a stores
eas submit --platform all
```

## 📊 Estado del Proyecto

### ✅ Entregables Completados (100%)
- [x] Definición de tecnologías seleccionadas
- [x] Commit inicial y control de versiones
- [x] Arquitectura de software documentada
- [x] Diagrama de base de datos completo
- [x] Frontend inicial estructurado y funcional
- [x] Backend inicial con API RESTful completa

### 🔄 En Desarrollo
- [ ] Migraciones y seeders de base de datos
- [ ] Tests unitarios y de integración
- [ ] Conexión completa frontend-backend
- [ ] Sistema de recompensas automático
- [ ] Documentación de API con Swagger

### 📅 Roadmap
- **v1.0** (Dic 2025): MVP con 15 lecciones, sistema de progreso completo
- **v1.1** (Ene 2026): Modo offline, notificaciones push
- **v1.2** (Feb 2026): Internacionalización (ES, EN)
- **v2.0** (Mar 2026): Sistema de avatares personalizables, comunidad

## 🤝 Contribución

Valoramos todas las contribuciones a este proyecto educativo inclusivo.

### Proceso
1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit siguiendo [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(lessons): agregar lecciones de multiplicación"
   ```
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request con descripción detallada

### Guidelines
- Seguir estructura de código existente
- Agregar tests para nuevas funcionalidades
- Actualizar documentación relevante
- Probar en iOS y Android antes del PR
- Respetar principios de accesibilidad

### Código de Conducta
Este proyecto sigue un código de conducta inclusivo. Tratamos a todos con respeto y profesionalismo.

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

**Cuenta Conmigo Team**
- Desarrollado con ❤️ para promover la educación matemática inclusiva
- Proyecto académico para aprendizaje de desarrollo full-stack

## 📞 Contacto y Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/cuenta-conmigo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/cuenta-conmigo/discussions)
- **Email**: contacto@cuentaconmigo.com (ejemplo)

## 🙏 Agradecimientos

- Comunidad de React Native y Expo
- PostgreSQL y Node.js communities
- Diseñadores de fuentes accesibles (Atkinson Hyperlegible, Fredoka)
- Todos los contribuidores y testers

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0  
**Estado**: ✅ MVP Inicial Completado
