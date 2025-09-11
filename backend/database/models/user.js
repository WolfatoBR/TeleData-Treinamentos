const { Sequelize } = require("sequelize")
const connection = require("../connection") // Importa a conexão do meu banco.


const User = sequelize.define("User", {
  
    user_id: {
    type: sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  full_name: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  email: {
    type: sequelize.STRING(255),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  profile_headline: {
    type: sequelize.STRING(255),
    allowNull: true
  },
  biography: {
    type: sequelize.TEXT,
    allowNull: true
  },
  profile_image_url: {
    type: sequelize.STRING(2048),
    allowNull: true
  },
  created_at: {
    type: sequelize.DATE,
    allowNull: false,
    defaultValue: sequelize.NOW
  },
  updated_at: {
    type: sequelize.DATE,
    allowNull: false,
    defaultValue: sequelize.NOW
  }
}, {
  tableName: "Users",
  timestamps: false
})


module.exports =  User ; 