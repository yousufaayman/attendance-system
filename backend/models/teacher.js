'use strict';

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
  });

  Teacher.associate = function(models) {
    Teacher.hasMany(models.Class, { foreignKey: 'teacher_id', onDelete: 'CASCADE'  });
    Teacher.belongsToMany(models.Course, {
      through: 'CourseInstructors',
      foreignKey: 'teacher_id',
      onDelete: 'CASCADE' 
    });
  };

  return Teacher;
};
