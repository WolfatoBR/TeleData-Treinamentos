const express = require("express"); 
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./database/connection");
const path = require("path");

// Importando rotas existentes
const home = require("./routes/home");
const profileRouter = require("./routes/profileRoutes");
const registerpageRoute = require("./routes/registerpageRoutes");
const registeruserRoute = require("./routes/registeruser");
const loginpageRoute = require("./routes/loginpageRoute");
const makeloginRoute = require("./routes/authRoutes");

// Importando rotas de pagamento
const paymentRoutes = require("./routes/paymentRoutes");

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "Front-end", "Pages"));

// Servir CSS, JS, imagens
app.use(express.static(path.join(__dirname, "..", "Front-end")));

// Middlewares
app.use(cors()); // Permite requisições do frontend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sincronizando banco
connection.sync({ alter: true })
  .then(() => console.log("✅ Banco sincronizado"))
  .catch(console.error);

// Usando rotas existentes
app.use("/", home); // rota principal
app.use("/profile", profileRouter); // rota privada
app.use("/registerpage", registerpageRoute); // rota de cadastro
app.use("/registeruser", registeruserRoute); // rota de cadastro de usuário
app.use("/loginpage", loginpageRoute); // rota de login page
app.use("/makelogin", makeloginRoute); // rota de login

// Rotas de pagamento (PagSeguro)
app.use("/api", paymentRoutes); // rotas da API de pagamento

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

// Servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`📡 API de pagamento disponível em http://localhost:${port}/api`);
  console.log(`🌐 Frontend disponível em http://localhost:${port}`);
});