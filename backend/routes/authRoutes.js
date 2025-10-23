const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../database/models/user");

const router = express.Router();

const {handleError} = require("../utils/handleError"); // Importa minha função de tratar erro.
const ErrorModel = require("../database/models/error"); // Importa meu model Error
// Rota de login
router.post("/", async (req, res) => {
  console.log("Requisição recebida:", req.body); // Log para depuração
  
  try {
    const email = req.body.useremail;
    const password = req.body.userpassword;
    
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

    res.redirect("/") // Vamos por a rota de dashboard aqui



  } catch (err) {
    console.error(err);
    res.status(500).send("Erro interno no servidor");
  }

});

module.exports = router;
