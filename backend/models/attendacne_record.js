'use strict';

module.exports = (sequelize, DataTypes) => {
  const AttendanceRecord = sequelize.define('AttendanceRecord', {
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Students',
        key: 'id'
      }
    },
    class_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Classes',
        key: 'id'
      }
    },
    check_in_time: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('Present', 'Absent', 'Late')
    }
  });

  AttendanceRecord.associate = function(models) {
    AttendanceRecord.belongsTo(models.Student, { foreignKey: 'student_id' });
    AttendanceRecord.belongsTo(models.Class, { foreignKey: 'class_id' });
  };

  return AttendanceRecord;
};
