'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
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
    }
  }, {
    hooks: {
      beforeCreate: async (teacher) => {
        teacher.password = await bcrypt.hash(teacher.password, 10);
      }
    }
  });

  Teacher.associate = function(models) {
    Teacher.hasMany(models.Class, { foreignKey: 'teacher_id' });
    Teacher.belongsToMany(models.Course, {
      through: 'CourseInstructors',
      foreignKey: 'teacher_id'
    });
  };

  return Teacher;
};
