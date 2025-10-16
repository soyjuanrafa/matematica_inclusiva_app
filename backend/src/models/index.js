const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Inicializar Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
    dialectOptions: config.dialectOptions || {}
  }
);

// Importar modelos
const User = require('./User')(sequelize);
const Lesson = require('./Lesson')(sequelize);
const Progress = require('./Progress')(sequelize);
const Reward = require('./Reward')(sequelize);
const UserReward = require('./UserReward')(sequelize);

// Definir relaciones
// User 1:N Progress
User.hasMany(Progress, { foreignKey: 'user_id', as: 'progress' });
Progress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Lesson 1:N Progress
Lesson.hasMany(Progress, { foreignKey: 'lesson_id', as: 'progress' });
Progress.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

// User M:N Reward (a través de UserReward)
User.belongsToMany(Reward, { 
  through: UserReward, 
  foreignKey: 'user_id',
  otherKey: 'reward_id',
  as: 'rewards' 
});

Reward.belongsToMany(User, { 
  through: UserReward, 
  foreignKey: 'reward_id',
  otherKey: 'user_id',
  as: 'users' 
});

// Exportar modelos y sequelize
const db = {
  sequelize,
  Sequelize,
  User,
  Lesson,
  Progress,
  Reward,
  UserReward
};

module.exports = db;
