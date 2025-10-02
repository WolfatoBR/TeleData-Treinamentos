const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  enrollment_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('credit_card', 'boleto', 'pix', 'paypal'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'),
    defaultValue: 'pending'
  },
  external_payment_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  installments: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  payment_details: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'Payments',
  timestamps: true,
  underscored: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Payment;