# Cuenta Conmigo - App de Matemáticas Inclusivas

Una aplicación móvil educativa diseñada para enseñar matemáticas de manera inclusiva y accesible, especialmente para estudiantes con discapacidades.

## Características Principales

### 🎯 Operaciones CRUD
- **Usuarios**: Crear, leer, actualizar y eliminar cuentas de usuario.
- **Lecciones**: Gestión completa de contenido educativo.
- **Progreso**: Seguimiento y actualización del progreso del estudiante.
- **Logros**: Sistema de recompensas con operaciones CRUD.

### ✅ Validación de Datos
- Validación en tiempo real en formularios de login y registro.
- Verificación de formato de email y longitud de contraseña.
- Mensajes de error claros y accesibles.

### 🌐 Integración con APIs del Backend
- Cliente API RESTful genérico para comunicación con servidor.
- Manejo de autenticación JWT.
- Sincronización de datos entre dispositivo y servidor.
- Intercepción de errores y manejo de respuestas.

### 📱 Diseño de la Interfaz (5 Pantallas Mejoradas)
1. **HomeScreen**: Dashboard interactivo con estadísticas clicables.
2. **LoginScreen**: Autenticación con validación visual.
3. **LessonScreen**: Lecciones interactivas con feedback inmediato.
4. **ProfileScreen**: Perfil personalizable con configuraciones.
5. **RewardsScreen**: Visualización de logros y estadísticas.

### ♿ Características de Accesibilidad
- Texto a voz integrado.
- Alto contraste y modos visuales adaptables.
- Navegación por voz y gestos.
- Personajes inclusivos con diversidad representada.

### 📊 Sistema de Progreso
- Niveles y puntos de experiencia.
- Seguimiento de racha diaria.
- Estadísticas detalladas de rendimiento.

## Tecnologías Utilizadas

- **Frontend**: React Native, Expo
- **Estado**: Context API
- **API**: Axios para llamadas HTTP
- **Persistencia**: AsyncStorage
- **Accesibilidad**: Expo Speech, configuraciones personalizables
- **UI**: Styled Components, fuentes inclusivas

## Instalación y Uso

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd matematica_inclusiva_app
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Configura la URL del backend en `src/services/apiService.js`

4. Ejecuta la aplicación:
   ```bash
   npm start
   # o
   expo start
   ```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── context/            # Gestión de estado global
├── navigation/         # Configuración de navegación
├── screens/           # Pantallas de la aplicación
├── services/          # Servicios API y utilidades
├── theme.js           # Tema y constantes
└── utils/             # Utilidades auxiliares
```

## Documentación Adicional

- [Justificación del Sistema](JUSTIFICACION_DEL_SISTEMA.md)
- [Diagrama de Flujo](DIAGRAMA_FLUJO_SISTEMA.md)
- [Assets y Recursos](README_ASSETS.md)

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Proyecto desarrollado para promover la educación matemática inclusiva.
