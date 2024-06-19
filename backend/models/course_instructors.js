'use strict';

module.exports = (sequelize, DataTypes) => {
  const CourseInstructors = sequelize.define('CourseInstructors', {
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Courses',
        key: 'id',
        onDelete: 'CASCADE',
      }
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Teachers',
        key: 'id',
        onDelete: 'CASCADE',
      }
    }
  });

  return CourseInstructors;
};
