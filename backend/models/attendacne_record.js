'use strict';

module.exports = (sequelize, DataTypes) => {
  const AttendanceRecord = sequelize.define('AttendanceRecord', {
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Students',
        key: 'id'
      },
      onDelete: 'CASCADE',
    },
    class_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Classes',
        key: 'id'
      },
      onDelete: 'CASCADE',

    },
    check_in_time: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('Present', 'Absent', 'Late')
    }
  });

  AttendanceRecord.associate = function(models) {
    AttendanceRecord.belongsTo(models.Student, { foreignKey: 'student_id',  onDelete: 'CASCADE' });
    AttendanceRecord.belongsTo(models.Class, { foreignKey: 'class_id', onDelete: 'CASCADE' });
  };

  return AttendanceRecord;
};
