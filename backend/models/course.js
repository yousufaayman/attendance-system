'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  });

  Course.associate = function(models) {
    Course.hasMany(models.Class, { foreignKey: 'course_id' });
    Course.hasMany(models.Group, { foreignKey: 'course_id' });
    Course.belongsToMany(models.Teacher, {
      through: 'CourseInstructors',
      foreignKey: 'course_id'
    });
  };

  return Course;
};
