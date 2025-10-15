const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../database/models/user");

const router = express.Router();

const {handleError} = require("../utils/handleError"); // Importa minha função de tratar erro.
const ErrorModel = require("../database/models/error"); // Importa meu model Error
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
    if (!isPasswordValid) return await handleError(error,res,ErrorModel);

    // Isso aqui basicamente é um (Update do Sql)
    await User.update(
      { is_online: true }, // Isso aqui atualiza o campo de is_online para true ( deixando o meu user online).
      { where: { user_id: user.user_id } } // isso diz que o user_id é igual ao user_id do usuario que fez o login.
    );

    // Gera o token JWT
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        email: user.email,
        user_type: user.user_type
      },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    // Você pode enviar o token junto no redirecionamento ou via JSON
    // Aqui vou enviar como cookie e redirecionar
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1 hora
    res.redirect("/"); // Redireciona para dashboard ou home

  } catch (error) {
    await handleError(error,res,ErrorModel);
    res.redirect("/loginpage"); // Redireciona de volta para a página de login em caso de erro
  }

});

module.exports = router;
