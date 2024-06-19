'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Teachers',
        key: 'id'
      },
      onDelete: 'CASCADE',
    }
  });

  Course.associate = function(models) {
    Course.hasMany(models.Class, { foreignKey: 'course_id' });
    Course.hasMany(models.Group, { foreignKey: 'course_id' });
    Course.belongsTo(models.Teacher, { foreignKey: 'teacher_id', onDelete: 'CASCADE' });
  };

  return Course;
};
