const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Lesson = sequelize.define('Lesson', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título no puede estar vacío'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    difficulty_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'El nivel de dificultad mínimo es 1'
        },
        max: {
          args: 5,
          msg: 'El nivel de dificultad máximo es 5'
        }
      }
    },
    topic: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El tema no puede estar vacío'
        }
      }
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'El índice de orden debe ser mayor o igual a 0'
        }
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    thumbnail_url: {
      type: DataTypes.TEXT,
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
    tableName: 'lessons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['topic'] },
      { fields: ['difficulty_level'] },
      { fields: ['order_index'] },
      { fields: ['is_active'] }
    ]
  });

  return Lesson;
};
