const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Enrollment = sequelize.define('Enrollment', {
  enrollment_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price_paid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  progress_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  enrolled_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Enrollments',
  timestamps: false
});

module.exports = Enrollment;