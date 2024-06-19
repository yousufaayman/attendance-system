'use strict';

module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Courses',
        key: 'id',
        onDelete: 'CASCADE',
      }
    },
    room_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Rooms',
        key: 'id',
        onDelete: 'SET NULL',
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
        key: 'id',
        onDelete: 'SET NULL',
      }
    }
  });

  Class.associate = function(models) {
    Class.belongsTo(models.Course, { foreignKey: 'course_id', onDelete: 'CASCADE'  });
    Class.belongsTo(models.Room, { foreignKey: 'room_id', onDelete: 'SET NULL'  });
    Class.belongsTo(models.Teacher, { foreignKey: 'teacher_id', onDelete: 'SET NULL' });
    Class.hasMany(models.AttendanceRecord, { foreignKey: 'class_id', onDelete: 'CASCADE'  });
  };

  return Class;
};
