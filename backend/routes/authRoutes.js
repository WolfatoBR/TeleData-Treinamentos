const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../database/models/user");

const router = express.Router();

// Rota de login
router.post("/login", async (req, res) => {
  console.log("Requisição recebida:", req.body); // Log para depuração
  
  try {
    const { email, password } = req.body; // Desestruturação
    if (!email || !password) {
      return res.status(400).send("Email e senha são obrigatórios");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).send("Credenciais inválidas");

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.status(401).send("Credenciais inválidas");

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro interno no servidor");
  }
});

module.exports = router;