const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserReward = sequelize.define('UserReward', {
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
    reward_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rewards',
        key: 'id'
      }
    },
    earned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'user_rewards',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['reward_id'] },
      { 
        unique: true, 
        fields: ['user_id', 'reward_id'],
        name: 'unique_user_reward'
      }
    ]
  });

  return UserReward;
};
