'use strict';

module.exports = (sequelize, DataTypes) => {
  const CourseInstructor = sequelize.define('CourseInstructor', {
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Teachers',
        key: 'id'
      }
    }
  });

  return CourseInstructor;
};
