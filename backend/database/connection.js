const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || "sqlite",
  storage: process.env.DB_STORAGE || "./database/database.sqlite",
  logging: console.log, // habilita logs de queries
});

sequelize.authenticate()
  .then(() => console.log("Conectado ao banco SQLite local!"))
  .catch(err => console.error("Erro ao conectar ao banco:", err));

module.exports = sequelize;
