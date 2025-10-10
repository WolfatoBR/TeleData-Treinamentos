const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../database/models/user");

const {handleError} = require("../utils/handleError"); // Importa minha função de tratar erro.
// Rota de registro de usuário
router.post("/", async (req, res) => {
  try {
    const name = req.body.username;       // Certifique-se de que o nome do campo no formulário é "username"
    const email = req.body.useremail;
    const password = req.body.userpassword;

    // Verifica se todos os campos foram enviados
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    // Gera hash da senha
    rounds = 12; // Número de rounds para bcrypt
    const password_hash = await bcrypt.hash(password, rounds);

    // Cria o usuário no banco
    const user = await User.create({
      full_name: name,        // Verifique se no model é realmente "full_name"
      email: email,
      password_hash: password_hash
    });

    res.redirect("/loginpage") // redireciona para a página inicial após o registro.
  } catch (error) {
    await handleError(error,res,ErrorCounter);
  }
});

module.exports = router;
