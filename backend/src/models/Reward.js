const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reward = sequelize.define('Reward', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre de la recompensa no puede estar vacío'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    badge_image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    points_required: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Los puntos requeridos deben ser mayores o iguales a 0'
        }
      }
    },
    reward_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: {
          args: [['badge', 'avatar', 'theme', 'title']],
          msg: 'Tipo de recompensa inválido. Debe ser: badge, avatar, theme o title'
        }
      }
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
    tableName: 'rewards',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['reward_type'] },
      { fields: ['points_required'] }
    ]
  });

  return Reward;
};
