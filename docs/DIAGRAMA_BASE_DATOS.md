# Diagrama de Base de Datos - Cuenta Conmigo

## Proyecto: Aplicación de Matemáticas Inclusivas
**Versión**: 1.0  
**Fecha**: Octubre 2025  
**Base de Datos**: PostgreSQL 15+

---

## Índice
1. [Diagrama Entidad-Relación (ERD)](#diagrama-entidad-relación-erd)
2. [Descripción de Tablas](#descripción-de-tablas)
3. [Relaciones](#relaciones)
4. [Índices y Constraints](#índices-y-constraints)
5. [Scripts SQL de Creación](#scripts-sql-de-creación)
6. [Datos de Ejemplo](#datos-de-ejemplo)

---

## Diagrama Entidad-Relación (ERD)

```
┌────────────────────────────────────────────────────────────────────────┐
│                         BASE DE DATOS - PostgreSQL                      │
└────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┐
│            users                │
├─────────────────────────────────┤
│ PK  id                SERIAL    │
│     email             VARCHAR(255) UNIQUE NOT NULL │
│     password_hash     VARCHAR(255) NOT NULL        │
│     name              VARCHAR(100) NOT NULL        │
│     age               INTEGER                      │
│     avatar_url        TEXT                         │
│     accessibility_preferences JSON               │
│     created_at        TIMESTAMP DEFAULT NOW()      │
│     updated_at        TIMESTAMP DEFAULT NOW()      │
└──────────┬──────────────────────┘
           │
           │ 1:N
           │
           ├────────────────────────────────────┐
           │                                    │
           │                                    │
           ▼                                    ▼
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│          progress               │  │        user_rewards             │
├─────────────────────────────────┤  ├─────────────────────────────────┤
│ PK  id             SERIAL       │  │ PK  id             SERIAL       │
│ FK  user_id        INTEGER  ───────┤│ FK  user_id        INTEGER  ───────┘
│ FK  lesson_id      INTEGER      │  │ FK  reward_id      INTEGER      │
│     score          INTEGER      │  │     earned_at      TIMESTAMP    │
│     attempts       INTEGER      │  │     created_at     TIMESTAMP    │
│     time_spent     INTEGER      │  └──────────┬──────────────────────┘
│     completed      BOOLEAN      │             │
│     completed_at   TIMESTAMP    │             │ N:1
│     created_at     TIMESTAMP    │             │
│     updated_at     TIMESTAMP    │             │
└──────────┬──────────────────────┘             │
           │                                    │
           │ N:1                                ▼
           │                          ┌─────────────────────────────────┐
           ▼                          │          rewards                │
┌─────────────────────────────────┐  ├─────────────────────────────────┤
│           lessons               │  │ PK  id              SERIAL      │
├─────────────────────────────────┤  │     name            VARCHAR(100)│
│ PK  id             SERIAL       │  │     description     TEXT        │
│     title          VARCHAR(200) │  │     badge_image_url TEXT        │
│     description    TEXT         │  │     points_required INTEGER     │
│     difficulty_level INTEGER    │  │     reward_type     VARCHAR(50) │
│     topic          VARCHAR(100) │  │     created_at      TIMESTAMP   │
│     content        JSON         │  │     updated_at      TIMESTAMP   │
│     order_index    INTEGER      │  └─────────────────────────────────┘
│     is_active      BOOLEAN      │
│     thumbnail_url  TEXT         │
│     created_at     TIMESTAMP    │
│     updated_at     TIMESTAMP    │
└─────────────────────────────────┘

LEYENDA:
PK = Primary Key
FK = Foreign Key
─── = Relación (línea continua indica foreign key)
1:N = Uno a Muchos
N:1 = Muchos a Uno
M:N = Muchos a Muchos (con tabla intermedia)
```

---

## Descripción de Tablas

### 1. `users` - Usuarios de la Aplicación

Almacena información de usuarios registrados con sus preferencias de accesibilidad.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único auto-incremental |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email del usuario (usado para login) |
| `password_hash` | VARCHAR(255) | NOT NULL | Contraseña hasheada con bcrypt |
| `name` | VARCHAR(100) | NOT NULL | Nombre completo del usuario |
| `age` | INTEGER | CHECK (age >= 3 AND age <= 100) | Edad del usuario |
| `avatar_url` | TEXT | NULL | URL de imagen de avatar/personaje |
| `accessibility_preferences` | JSON | DEFAULT '{}' | Preferencias de accesibilidad (text-to-speech, contraste, etc.) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación de cuenta |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última actualización de perfil |

**Ejemplo de `accessibility_preferences` JSON:**
```json
{
  "textToSpeech": true,
  "highContrast": false,
  "fontSize": "large",
  "voiceSpeed": 1.0,
  "characterSelected": "star"
}
```

---

### 2. `lessons` - Lecciones Educativas

Contiene las lecciones de matemáticas con su contenido estructurado.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único de lección |
| `title` | VARCHAR(200) | NOT NULL | Título de la lección |
| `description` | TEXT | NULL | Descripción detallada de la lección |
| `difficulty_level` | INTEGER | CHECK (difficulty_level BETWEEN 1 AND 5) | Nivel de dificultad (1=fácil, 5=difícil) |
| `topic` | VARCHAR(100) | NOT NULL | Tema matemático (suma, resta, multiplicación, etc.) |
| `content` | JSON | NOT NULL | Contenido estructurado de la lección (ejercicios, imágenes, audio) |
| `order_index` | INTEGER | NOT NULL | Orden de presentación de lecciones |
| `is_active` | BOOLEAN | DEFAULT TRUE | Si la lección está activa/disponible |
| `thumbnail_url` | TEXT | NULL | URL de imagen de preview |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última actualización de contenido |

**Ejemplo de `content` JSON:**
```json
{
  "introduction": {
    "text": "Aprende a sumar números del 1 al 10",
    "audioUrl": "https://cdn.example.com/audio/lesson1_intro.mp3"
  },
  "exercises": [
    {
      "id": "ex1",
      "type": "numeric_input",
      "question": "¿Cuánto es 2 + 3?",
      "answer": 5,
      "hint": "Cuenta con tus dedos"
    },
    {
      "id": "ex2",
      "type": "drag_drop",
      "question": "Arrastra el número correcto",
      "options": [4, 5, 6],
      "answer": 5
    }
  ],
  "rewards": {
    "completion": 10,
    "perfectScore": 20
  }
}
```

---

### 3. `progress` - Progreso de Usuarios en Lecciones

Registra el avance de cada usuario en cada lección (tracking individual).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único de progreso |
| `user_id` | INTEGER | FOREIGN KEY → users(id), NOT NULL | ID del usuario |
| `lesson_id` | INTEGER | FOREIGN KEY → lessons(id), NOT NULL | ID de la lección |
| `score` | INTEGER | CHECK (score >= 0 AND score <= 100) | Puntuación obtenida (0-100) |
| `attempts` | INTEGER | DEFAULT 1 | Número de intentos en esta lección |
| `time_spent` | INTEGER | NULL | Tiempo en segundos dedicado a la lección |
| `completed` | BOOLEAN | DEFAULT FALSE | Si completó exitosamente la lección |
| `completed_at` | TIMESTAMP | NULL | Fecha/hora de completación exitosa |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Primer intento |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Último intento |

**Restricciones adicionales:**
- `UNIQUE(user_id, lesson_id)`: Un usuario puede tener solo un registro de progreso por lección (actualizable)

**Índices:**
- Index on `(user_id, lesson_id)` para búsquedas rápidas
- Index on `user_id` para obtener todo el progreso de un usuario

---

### 4. `rewards` - Catálogo de Recompensas

Define las recompensas/logros disponibles en el sistema.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único de recompensa |
| `name` | VARCHAR(100) | NOT NULL | Nombre de la recompensa |
| `description` | TEXT | NULL | Descripción del logro |
| `badge_image_url` | TEXT | NULL | URL de imagen del badge/insignia |
| `points_required` | INTEGER | NOT NULL | Puntos necesarios para desbloquear |
| `reward_type` | VARCHAR(50) | NOT NULL | Tipo de recompensa (badge, avatar, theme) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Última actualización |

**Tipos de recompensas (reward_type):**
- `badge`: Insignia o medalla
- `avatar`: Personaje o avatar desbloqueable
- `theme`: Tema visual
- `title`: Título o rango

**Ejemplos de recompensas:**
- "Primera Lección Completada" (10 puntos)
- "Maestro de Sumas" (50 puntos)
- "Racha de 7 Días" (100 puntos)
- "Perfeccionista" (completar 5 lecciones con 100%)

---

### 5. `user_rewards` - Recompensas Ganadas por Usuarios

Tabla intermedia que relaciona usuarios con recompensas ganadas (M:N).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único |
| `user_id` | INTEGER | FOREIGN KEY → users(id), NOT NULL | ID del usuario |
| `reward_id` | INTEGER | FOREIGN KEY → rewards(id), NOT NULL | ID de la recompensa |
| `earned_at` | TIMESTAMP | DEFAULT NOW() | Fecha/hora en que se ganó |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Registro de creación |

**Restricciones adicionales:**
- `UNIQUE(user_id, reward_id)`: Un usuario no puede ganar la misma recompensa dos veces

**Índices:**
- Index on `user_id` para obtener todas las recompensas de un usuario
- Index on `reward_id` para estadísticas de recompensas

---

## Relaciones

### 1. `users` → `progress` (1:N)
- **Cardinalidad**: Un usuario puede tener múltiples registros de progreso
- **Tipo**: Uno a Muchos
- **Foreign Key**: `progress.user_id` → `users.id`
- **Cascada**: `ON DELETE CASCADE` (si se borra usuario, se borra su progreso)

```sql
ALTER TABLE progress
ADD CONSTRAINT fk_progress_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE ON UPDATE CASCADE;
```

---

### 2. `lessons` → `progress` (1:N)
- **Cardinalidad**: Una lección puede tener múltiples registros de progreso (muchos usuarios)
- **Tipo**: Uno a Muchos
- **Foreign Key**: `progress.lesson_id` → `lessons.id`
- **Cascada**: `ON DELETE RESTRICT` (no se puede borrar lección si tiene progreso registrado)

```sql
ALTER TABLE progress
ADD CONSTRAINT fk_progress_lesson
FOREIGN KEY (lesson_id) REFERENCES lessons(id)
ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

### 3. `users` ↔ `rewards` (M:N) via `user_rewards`
- **Cardinalidad**: Un usuario puede ganar múltiples recompensas, una recompensa puede ser ganada por múltiples usuarios
- **Tipo**: Muchos a Muchos
- **Tabla intermedia**: `user_rewards`
- **Foreign Keys**: 
  - `user_rewards.user_id` → `users.id`
  - `user_rewards.reward_id` → `rewards.id`

```sql
ALTER TABLE user_rewards
ADD CONSTRAINT fk_user_rewards_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE user_rewards
ADD CONSTRAINT fk_user_rewards_reward
FOREIGN KEY (reward_id) REFERENCES rewards(id)
ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## Índices y Constraints

### Índices para Performance

```sql
-- Índices en users
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Índices en progress (queries frecuentes)
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_lesson_id ON progress(lesson_id);
CREATE UNIQUE INDEX idx_progress_user_lesson ON progress(user_id, lesson_id);
CREATE INDEX idx_progress_completed ON progress(completed, user_id);

-- Índices en lessons
CREATE INDEX idx_lessons_topic ON lessons(topic);
CREATE INDEX idx_lessons_difficulty ON lessons(difficulty_level);
CREATE INDEX idx_lessons_order ON lessons(order_index);
CREATE INDEX idx_lessons_active ON lessons(is_active);

-- Índices en user_rewards
CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX idx_user_rewards_reward_id ON user_rewards(reward_id);
CREATE UNIQUE INDEX idx_user_rewards_unique ON user_rewards(user_id, reward_id);

-- Índices en rewards
CREATE INDEX idx_rewards_type ON rewards(reward_type);
CREATE INDEX idx_rewards_points ON rewards(points_required);
```

### Constraints de Validación

```sql
-- Validación de edad
ALTER TABLE users
ADD CONSTRAINT check_age CHECK (age >= 3 AND age <= 100);

-- Validación de score
ALTER TABLE progress
ADD CONSTRAINT check_score CHECK (score >= 0 AND score <= 100);

-- Validación de intentos
ALTER TABLE progress
ADD CONSTRAINT check_attempts CHECK (attempts >= 1);

-- Validación de dificultad
ALTER TABLE lessons
ADD CONSTRAINT check_difficulty CHECK (difficulty_level BETWEEN 1 AND 5);

-- Validación de puntos requeridos
ALTER TABLE rewards
ADD CONSTRAINT check_points CHECK (points_required >= 0);
```

---

## Scripts SQL de Creación

### Script Completo de Creación de Base de Datos

```sql
-- ============================================
-- DATABASE CREATION SCRIPT
-- Project: Cuenta Conmigo - Matemáticas Inclusivas
-- Database: PostgreSQL 15+
-- ============================================

-- Crear base de datos
CREATE DATABASE cuenta_conmigo_db
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_ES.UTF-8'
    LC_CTYPE = 'es_ES.UTF-8'
    TEMPLATE = template0;

\c cuenta_conmigo_db;

-- Habilitar extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda de texto

-- ============================================
-- TABLA: users
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INTEGER CHECK (age >= 3 AND age <= 100),
    avatar_url TEXT,
    accessibility_preferences JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por email
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: lessons
-- ============================================
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    content JSON NOT NULL,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas comunes
CREATE INDEX idx_lessons_topic ON lessons(topic);
CREATE INDEX idx_lessons_difficulty ON lessons(difficulty_level);
CREATE INDEX idx_lessons_order ON lessons(order_index);
CREATE INDEX idx_lessons_active ON lessons(is_active);

-- Trigger para updated_at
CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: progress
-- ============================================
CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    attempts INTEGER DEFAULT 1 CHECK (attempts >= 1),
    time_spent INTEGER, -- en segundos
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) 
        REFERENCES lessons(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Índices para performance
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_lesson_id ON progress(lesson_id);
CREATE UNIQUE INDEX idx_progress_user_lesson ON progress(user_id, lesson_id);
CREATE INDEX idx_progress_completed ON progress(completed, user_id);

-- Trigger para updated_at
CREATE TRIGGER update_progress_updated_at
BEFORE UPDATE ON progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: rewards
-- ============================================
CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    badge_image_url TEXT,
    points_required INTEGER CHECK (points_required >= 0) NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_rewards_type ON rewards(reward_type);
CREATE INDEX idx_rewards_points ON rewards(points_required);

-- Trigger para updated_at
CREATE TRIGGER update_rewards_updated_at
BEFORE UPDATE ON rewards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: user_rewards (Intermedia M:N)
-- ============================================
CREATE TABLE user_rewards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    reward_id INTEGER NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_rewards_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_user_rewards_reward FOREIGN KEY (reward_id) 
        REFERENCES rewards(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices
CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX idx_user_rewards_reward_id ON user_rewards(reward_id);
CREATE UNIQUE INDEX idx_user_rewards_unique ON user_rewards(user_id, reward_id);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Estadísticas de progreso por usuario
CREATE VIEW user_stats AS
SELECT 
    u.id AS user_id,
    u.name,
    COUNT(p.id) AS total_lessons_attempted,
    COUNT(p.id) FILTER (WHERE p.completed = TRUE) AS lessons_completed,
    AVG(p.score) AS average_score,
    SUM(p.time_spent) AS total_time_spent,
    COUNT(ur.id) AS rewards_earned
FROM users u
LEFT JOIN progress p ON u.id = p.user_id
LEFT JOIN user_rewards ur ON u.id = ur.user_id
GROUP BY u.id, u.name;

-- Vista: Ranking de usuarios por puntos
CREATE VIEW leaderboard AS
SELECT 
    u.id,
    u.name,
    u.avatar_url,
    COUNT(p.id) FILTER (WHERE p.completed = TRUE) AS lessons_completed,
    AVG(p.score) FILTER (WHERE p.completed = TRUE) AS avg_score,
    COUNT(ur.id) AS rewards_count
FROM users u
LEFT JOIN progress p ON u.id = p.user_id
LEFT JOIN user_rewards ur ON u.id = ur.user_id
GROUP BY u.id, u.name, u.avatar_url
ORDER BY lessons_completed DESC, avg_score DESC;

-- ============================================
-- COMENTARIOS EN TABLAS (Documentación)
-- ============================================
COMMENT ON TABLE users IS 'Usuarios registrados de la aplicación';
COMMENT ON TABLE lessons IS 'Lecciones de matemáticas disponibles';
COMMENT ON TABLE progress IS 'Progreso de usuarios en lecciones';
COMMENT ON TABLE rewards IS 'Catálogo de recompensas y logros';
COMMENT ON TABLE user_rewards IS 'Recompensas ganadas por usuarios (relación M:N)';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
```

---

## Datos de Ejemplo

### Insertar Datos de Prueba

```sql
-- ============================================
-- SEED DATA - Datos de Ejemplo
-- ============================================

-- Insertar usuarios de prueba
INSERT INTO users (email, password_hash, name, age, avatar_url, accessibility_preferences) VALUES
('maria@example.com', '$2b$10$examplehashedpassword1', 'María García', 8, 'https://example.com/avatars/maria.png', '{"textToSpeech": true, "highContrast": false, "fontSize": "medium"}'),
('juan@example.com', '$2b$10$examplehashedpassword2', 'Juan Pérez', 10, 'https://example.com/avatars/juan.png', '{"textToSpeech": false, "highContrast": true, "fontSize": "large"}'),
('sofia@example.com', '$2b$10$examplehashedpassword3', 'Sofía Martínez', 7, 'https://example.com/avatars/sofia.png', '{"textToSpeech": true, "highContrast": true, "fontSize": "large"}');

-- Insertar lecciones
INSERT INTO lessons (title, description, difficulty_level, topic, content, order_index, is_active) VALUES
('Suma Básica 1-10', 'Aprende a sumar números del 1 al 10', 1, 'suma', '{"exercises": [{"question": "2 + 3 = ?", "answer": 5}]}', 1, TRUE),
('Resta Básica 1-10', 'Aprende a restar números del 1 al 10', 1, 'resta', '{"exercises": [{"question": "5 - 2 = ?", "answer": 3}]}', 2, TRUE),
('Suma con Llevadas', 'Sumas de dos dígitos con llevadas', 2, 'suma', '{"exercises": [{"question": "15 + 28 = ?", "answer": 43}]}', 3, TRUE),
('Tablas de Multiplicar del 2', 'Aprende la tabla del 2', 2, 'multiplicacion', '{"exercises": [{"question": "2 × 4 = ?", "answer": 8}]}', 4, TRUE);

-- Insertar progreso
INSERT INTO progress (user_id, lesson_id, score, attempts, completed, completed_at) VALUES
(1, 1, 100, 1, TRUE, NOW() - INTERVAL '2 days'),
(1, 2, 85, 2, TRUE, NOW() - INTERVAL '1 day'),
(2, 1, 95, 1, TRUE, NOW() - INTERVAL '3 days'),
(3, 1, 70, 3, FALSE, NULL);

-- Insertar recompensas
INSERT INTO rewards (name, description, badge_image_url, points_required, reward_type) VALUES
('Primera Lección', 'Completa tu primera lección', 'https://example.com/badges/first_lesson.png', 10, 'badge'),
('Maestro de Sumas', 'Completa 5 lecciones de suma', 'https://example.com/badges/suma_master.png', 50, 'badge'),
('Perfeccionista', 'Obtén 100% en una lección', 'https://example.com/badges/perfect.png', 20, 'badge'),
('Racha de 7 Días', 'Estudia 7 días seguidos', 'https://example.com/badges/streak7.png', 100, 'badge');

-- Insertar recompensas ganadas
INSERT INTO user_rewards (user_id, reward_id, earned_at) VALUES
(1, 1, NOW() - INTERVAL '2 days'),
(1, 3, NOW() - INTERVAL '2 days'),
(2, 1, NOW() - INTERVAL '3 days');
```

---

## Consultas SQL Útiles

### Obtener progreso completo de un usuario
```sql
SELECT 
    u.name,
    l.title AS lesson_title,
    p.score,
    p.attempts,
    p.completed,
    p.completed_at
FROM users u
JOIN progress p ON u.id = p.user_id
JOIN lessons l ON p.lesson_id = l.id
WHERE u.id = 1
ORDER BY l.order_index;
```

### Obtener recompensas ganadas por un usuario
```sql
SELECT 
    r.name,
    r.description,
    ur.earned_at
FROM user_rewards ur
JOIN rewards r ON ur.reward_id = r.id
WHERE ur.user_id = 1
ORDER BY ur.earned_at DESC;
```

### Calcular puntos totales de un usuario
```sql
SELECT 
    u.name,
    SUM(p.score) AS total_points,
    COUNT(p.id) FILTER (WHERE p.completed = TRUE) AS lessons_completed
FROM users u
LEFT JOIN progress p ON u.id = p.user_id
WHERE u.id = 1
GROUP BY u.id, u.name;
```

### Leaderboard (ranking de usuarios)
```sql
SELECT 
    u.name,
    COUNT(p.id) FILTER (WHERE p.completed = TRUE) AS lessons_completed,
    AVG(p.score) AS avg_score,
    COUNT(ur.id) AS rewards_count
FROM users u
LEFT JOIN progress p ON u.id = p.user_id
LEFT JOIN user_rewards ur ON u.id = ur.user_id
GROUP BY u.id, u.name
ORDER BY lessons_completed DESC, avg_score DESC
LIMIT 10;
```

---

## Normalización y Diseño

### Forma Normal
- **Primera Forma Normal (1NF)**: ✅ Todos los atributos son atómicos
- **Segunda Forma Normal (2NF)**: ✅ No hay dependencias parciales
- **Tercera Forma Normal (3NF)**: ✅ No hay dependencias transitivas

### Justificación de Diseño

**¿Por qué tabla intermedia `user_rewards`?**
- Relación M:N: Un usuario puede ganar múltiples recompensas, una recompensa puede ser ganada por múltiples usuarios
- Permite almacenar metadata adicional (earned_at)
- Facilita queries de "¿quién ha ganado esta recompensa?"

**¿Por qué JSON en `content` y `accessibility_preferences`?**
- **Flexibilidad**: Contenido de lecciones puede variar (texto, audio, imágenes, ejercicios)
- **Evolución**: Nuevos tipos de ejercicios sin migrar schema
- **PostgreSQL**: Excelente soporte para JSON (queries, índices GIN)
- **Performance**: Evita múltiples tablas relacionadas para ejercicios

**¿Por qué UNIQUE(user_id, lesson_id) en `progress`?**
- Un usuario solo debe tener un registro de progreso por lección
- Se actualiza el registro existente en lugar de crear duplicados
- Simplifica queries y evita inconsistencias

---

## Conclusión

Este diseño de base de datos proporciona:

1. ✅ **Integridad**: Foreign keys y constraints garantizan datos consistentes
2. ✅ **Escalabilidad**: Índices optimizados para queries frecuentes
3. ✅ **Flexibilidad**: JSON para datos semi-estructurados
4. ✅ **Normalización**: 3NF evita redundancia
5. ✅ **Trazabilidad**: Timestamps en todas las tablas
6. ✅ **Extensibilidad**: Fácil agregar nuevas tablas (ej: comments, forums)

El esquema está preparado para soportar crecimiento de usuarios y contenido sin refactorización mayor.

---

**Documento generado**: Octubre 2025  
**Última actualización**: 2025-10-16  
**Autor**: Equipo de Desarrollo Cuenta Conmigo
