const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Progress = sequelize.define('Progress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lessons',
        key: 'id'
      }
    },
    score: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 0,
          msg: 'El puntaje mínimo es 0'
        },
        max: {
          args: 100,
          msg: 'El puntaje máximo es 100'
        }
      }
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: {
          args: 1,
          msg: 'Debe haber al menos 1 intento'
        }
      }
    },
    time_spent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Tiempo en segundos'
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'progress',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['lesson_id'] },
      { 
        unique: true, 
        fields: ['user_id', 'lesson_id'],
        name: 'unique_user_lesson'
      },
      { fields: ['completed', 'user_id'] }
    ],
    hooks: {
      beforeUpdate: (progress) => {
        if (progress.changed('completed') && progress.completed === true && !progress.completed_at) {
          progress.completed_at = new Date();
        }
      }
    }
  });

  return Progress;
};
