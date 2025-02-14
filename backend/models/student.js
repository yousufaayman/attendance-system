'use strict';

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    group_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups',
        key: 'id',
        onDelete: 'CASCADE',
      }
    }
  });

  Student.associate = function(models) {
    Student.belongsTo(models.Group, { foreignKey: 'group_id', onDelete: 'SET NULL'  });
    Student.hasMany(models.AttendanceRecord, { foreignKey: 'student_id', onDelete: 'SET NULL' });
  };

  return Student;
};
