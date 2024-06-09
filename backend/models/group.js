'use strict';

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Courses',
        key: 'id'
      }
    }
  });

  Group.associate = function(models) {
    Group.belongsTo(models.Course, { foreignKey: 'course_id' });
    Group.hasMany(models.Student, { foreignKey: 'group_id' });
  };

  return Group;
};
