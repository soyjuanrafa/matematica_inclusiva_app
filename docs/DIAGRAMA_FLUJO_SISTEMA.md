# Diagrama de Flujo del Sistema: "Cuenta Conmigo"

```mermaid
flowchart TD
    A[Inicio de la App] --> B{Usuario Autenticado?}
    B -->|No| C[Pantalla de Login]
    C --> D[Validar Credenciales]
    D -->|Éxito| E[Autenticar Usuario]
    D -->|Error| F[Mostrar Error de Validación]
    F --> C
    E --> G[Pantalla Principal - Home]
    B -->|Sí| G

    G --> H{Seleccionar Acción}
    H -->|Ver Perfil| I[Pantalla de Perfil]
    H -->|Ver Lecciones| J[Pantalla de Selección de Lecciones]
    H -->|Ver Logros| K[Pantalla de Recompensas]
    H -->|Configurar Accesibilidad| L[Pantalla de Configuración de Accesibilidad]
    H -->|Elegir Personaje| M[Pantalla de Personajes]

    J --> N{Seleccionar Lección}
    N --> O[Cargar Lección]
    O --> P[Mostrar Pregunta]
    P --> Q{Usuario Responde}
    Q --> R{Tipo de Ejercicio}
    R -->|Múltiple Opción| RA[Seleccionar Opción]
    R -->|Input Numérico| RB[Ingresar Número]
    R -->|Drag & Drop| RC[Arrastrar Elemento]
    RA --> RD{Respuesta Correcta?}
    RB --> RD
    RC --> RD
    RD -->|Sí| S[Mostrar Feedback Positivo + Sonido]
    RD -->|No| T[Mostrar Feedback Correctivo + Sonido + Log Error]
    S --> U[Siguiente Pregunta]
    T --> U
    U --> V{Más Preguntas?}
    V -->|Sí| P
    V -->|No| W[Calcular Puntaje y Tiempo Total]
    W --> X[Actualizar Progreso + Analytics]
    X --> Y[Pantalla de Completación de Lección]
    Y --> G

    I --> Z{Editar Perfil?}
    Z -->|Sí| AA[Editar Información]
    AA --> BB[Validar Datos]
    BB -->|Éxito| CC[Guardar Cambios]
    BB -->|Error| DD[Mostrar Errores]
    DD --> AA
    CC --> I
    Z -->|No| I

    K --> EE[Mostrar Logros y Estadísticas]

    L --> FF[Configurar Opciones de Accesibilidad]

    M --> GG[Seleccionar Personaje]
    GG --> HH[Actualizar Avatar]
    HH --> G

    G --> II{Cerrar Sesión?}
    II -->|Sí| JJ[Cerrar Sesión]
    JJ --> A
    II -->|No| G
```

## Descripción del Flujo Actualizado
1. **Inicio**: La app verifica si el usuario está autenticado.
2. **Autenticación**: Si no, muestra login con validación.
3. **Navegación Principal**: Desde Home, el usuario puede acceder a diferentes secciones.
4. **Lecciones Mejoradas**:
   - **Tipos de Ejercicio**: Soporte para múltiple opción, input numérico y drag & drop
   - **Feedback Interactivo**: Sonidos, haptics y explicaciones
   - **Analytics**: Tracking de tiempo total y errores por pregunta
   - **Progreso**: Actualización con métricas detalladas
5. **Perfil**: Vista y edición con validación.
6. **Otras Pantallas**: Logros, accesibilidad, personajes.
7. **Cierre**: Opción para cerrar sesión y volver al inicio.

Este diagrama muestra el flujo completo de la aplicación, destacando la integración de validación de datos, operaciones CRUD, características de accesibilidad, y las nuevas funcionalidades de ejercicios variados y analytics de aprendizaje.
