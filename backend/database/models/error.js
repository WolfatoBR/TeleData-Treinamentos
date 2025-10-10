const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const ErrorCounter = sequelize.define(
  "ErrorCounter",
  {
    error_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    error_message:{
      type: DataTypes.STRING(255),
      allowNull: false
    },
    error_type:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    update_at:{
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: "ErrorCounter",
    timestamps: false,
  }
);

module.exports = ErrorCounter;
