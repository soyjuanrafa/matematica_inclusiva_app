require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Permite conexiones externas

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexión a base de datos
    console.log('🔌 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');

    // Sincronizar modelos (solo en desarrollo - en producción usar migrations)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Sincronizando modelos con la base de datos...');
      await sequelize.sync({ alter: false }); // alter: true para actualizar esquema
      console.log('✅ Modelos sincronizados');
    }

    // Iniciar servidor Express
    app.listen(PORT, HOST, () => {
      console.log('\n🚀 ======================================');
      console.log(`   Servidor iniciado exitosamente`);
      console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Puerto: ${PORT}`);
      console.log(`   URL: http://${HOST}:${PORT}`);
      console.log(`   Health Check: http://${HOST}:${PORT}/health`);
      console.log('   ======================================\n');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('⚠️  Uncaught Exception:', error);
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  console.log('⏹️  SIGTERM recibido. Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n⏹️  SIGINT recibido. Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

// Iniciar servidor
startServer();
