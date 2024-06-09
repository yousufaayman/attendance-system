'use strict';

module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Room.associate = function(models) {
    Room.hasMany(models.Class, { foreignKey: 'room_id' });
  };

  return Room;
};
