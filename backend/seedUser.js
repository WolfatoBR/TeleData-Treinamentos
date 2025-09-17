const bcrypt = require("bcrypt");
const User = require("./database/models/user");
const connection = require("./database/connection");

async function seedUser() {
  try {
    await connection.authenticate();
    console.log("Conexão com o banco bem-sucedida!");

    // Garante que as tabelas existam
    await connection.sync();

    const full_name = "caio";
    const email = "caio@teste.com";
    const password = "123456";

    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco
    const user = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
    });

    console.log("Usuário criado com sucesso:", user.toJSON());
    process.exit(0);
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    process.exit(1);
  }
}

seedUser();