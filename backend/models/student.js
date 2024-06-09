'use strict';
const bcrypt = require('bcrypt');

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
        key: 'id'
      }
    }
  }, {
    hooks: {
      beforeCreate: async (student) => {
        student.password = await bcrypt.hash(student.password, 10);
      }
    }
  });

  Student.associate = function(models) {
    Student.belongsTo(models.Group, { foreignKey: 'group_id' });
    Student.hasMany(models.AttendanceRecord, { foreignKey: 'student_id' });
  };

  return Student;
};
