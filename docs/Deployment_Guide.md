# Guía de Despliegue - Matemática Inclusiva App

## 📋 Prerrequisitos

### Sistema
- Node.js 16+ instalado
- npm o yarn
- Git

### Base de Datos
- MongoDB Atlas (producción)
- MongoDB local (desarrollo)

### Infraestructura
- Servidor con Node.js support
- Dominio configurado (opcional)

## 🚀 Despliegue Local

### 1. Clonar Repositorio
```bash
git clone <repository-url>
cd matematica_inclusiva_app
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env`:
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here
MONGODB_URI=mongodb://localhost:27017/matematica_inclusiva
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```

### 5. Verificar Funcionamiento
```bash
curl http://localhost:3000/api/health
```

## 🌐 Despliegue en Producción

### Opción 1: Heroku

#### 1. Crear aplicación en Heroku
```bash
heroku create matematica-inclusiva-app
```

#### 2. Configurar variables de entorno
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_jwt_secret
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
```

#### 3. Desplegar
```bash
git push heroku main
```

#### 4. Verificar
```bash
heroku open
curl https://matematica-inclusiva-app.herokuapp.com/api/health
```

### Opción 2: DigitalOcean App Platform

#### 1. Conectar repositorio
- Ir a DigitalOcean App Platform
- Crear nueva app
- Conectar repositorio GitHub

#### 2. Configurar app spec
```yaml
name: matematica-inclusiva
services:
- name: api
  source_dir: /
  github:
    repo: your-username/matematica_inclusiva_app
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    value: your_production_jwt_secret
  - key: MONGODB_URI
    value: your_mongodb_atlas_uri
```

### Opción 3: VPS (Ubuntu/Debian)

#### 1. Provisionar servidor
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2
```

#### 2. Configurar aplicación
```bash
# Clonar código
git clone <repository-url>
cd matematica_inclusiva_app

# Instalar dependencias
npm install

# Crear archivo .env
nano .env
```

Contenido de .env:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_production_jwt_secret
MONGODB_URI=your_mongodb_atlas_uri
```

#### 3. Configurar PM2
```bash
# Crear archivo ecosystem.config.js
nano ecosystem.config.js
```

Contenido:
```javascript
module.exports = {
  apps: [{
    name: 'matematica-inclusiva',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

#### 4. Iniciar aplicación
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5. Configurar Nginx (opcional)
```bash
sudo apt install nginx -y

# Crear configuración
sudo nano /etc/nginx/sites-available/matematica-inclusiva
```

Contenido:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/matematica-inclusiva /etc/nginx/sites-enabled/

# Reiniciar Nginx
sudo systemctl restart nginx
```

## 🗄️ Configuración de Base de Datos

### MongoDB Atlas (Recomendado)

1. Crear cuenta en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crear nuevo cluster
3. Configurar usuario de base de datos
4. Whitelist IP (0.0.0.0/0 para desarrollo)
5. Obtener connection string
6. Usar en MONGODB_URI

### Variables de Entorno de Producción

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=generate_a_strong_random_secret_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/matematica_inclusiva?retryWrites=true&w=majority
```

## 🔒 Configuración de Seguridad

### JWT Secret
```bash
# Generar secret seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### HTTPS (Obligatorio en producción)
- Usar Let's Encrypt para certificados gratuitos
- Configurar SSL/TLS en el servidor

### Firewall
```bash
# UFW básico
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 📊 Monitoreo

### PM2 Monitoring
```bash
pm2 monit
```

### Logs
```bash
pm2 logs matematica-inclusiva
```

### Health Checks
Configurar monitoring externo para:
- GET /api/health
- uptime del servidor
- uso de recursos

## 🔄 Actualizaciones

### Zero-downtime deployments
```bash
# Con PM2
pm2 reload ecosystem.config.js

# Con Heroku
git push heroku main
```

### Rollbacks
```bash
# PM2
pm2 revert matematica-inclusiva

# Heroku
heroku releases
heroku rollback v1
```

## 🧪 Testing en Producción

### Endpoints críticos
```bash
# Health check
curl https://your-domain.com/api/health

# Registro
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🚨 Troubleshooting

### Problemas Comunes

1. **Puerto ocupado**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **MongoDB connection error**
   - Verificar MONGODB_URI
   - Check whitelist IP en Atlas
   - Verificar credenciales

3. **PM2 no inicia**
   ```bash
   pm2 delete all
   pm2 start ecosystem.config.js
   ```

4. **Nginx errors**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

## 📈 Escalabilidad

### Horizontal Scaling
- Usar múltiples instancias con load balancer
- Redis para sesiones (si se implementa)
- CDN para assets estáticos

### Vertical Scaling
- Aumentar tamaño de instancia según necesidad
- Optimizar queries de base de datos
- Implementar caching

## 📞 Soporte

Para issues de despliegue:
1. Revisar logs: `pm2 logs`
2. Verificar variables de entorno
3. Testear localmente primero
4. Consultar documentación de la plataforma

---

**Última actualización**: Octubre 2025
**Versión**: 1.0.0
