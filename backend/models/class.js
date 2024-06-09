'use strict';

module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    room_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Rooms',
        key: 'id'
      }
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Teachers',
        key: 'id'
      }
    }
  });

  Class.associate = function(models) {
    Class.belongsTo(models.Course, { foreignKey: 'course_id' });
    Class.belongsTo(models.Room, { foreignKey: 'room_id' });
    Class.belongsTo(models.Teacher, { foreignKey: 'teacher_id' });
    Class.hasMany(models.AttendanceRecord, { foreignKey: 'class_id' });
  };

  return Class;
};
