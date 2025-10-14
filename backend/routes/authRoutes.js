const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../database/models/user");

const router = express.Router();

// Rota de login
router.post("/", async (req, res) => {
  console.log("Requisição recebida:", req.body);
  
  try {
    const email = req.body.useremail;
    const password = req.body.userpassword;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Criar token com user_type incluído
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        email: user.email,
        user_type: user.user_type
      },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    // Retornar token e dados do usuário
    res.json({
      message: "Login realizado com sucesso",
      token: token,
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

module.exports = router;