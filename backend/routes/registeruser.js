const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../database/models/user");

// Rota de registro de usuário
router.post("/registeruser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se todos os campos foram enviados
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    // Gera hash da senha
    const password_hash = await bcrypt.hash(password, 12);

    // Cria o usuário no banco
    const user = await User.create({
      full_name: name,        // Verifique se no model é realmente "full_name"
      email: email,
      password_hash: password_hash
    });

    return res.status(201).json({ message: "Usuário criado com sucesso", user: { id: user.id, name: user.full_name, email: user.email } });
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);

    // Checa se é erro de validação do Sequelize
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: err.errors.map(e => e.message) });
    }

    return res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

module.exports = router;
