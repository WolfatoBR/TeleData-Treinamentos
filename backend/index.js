const express = require("express"); 
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const connection = require("./database/connection");
const path = require("path");

// Importando rotas
const home = require("./routes/home");
const profileRouter = require("./routes/profileRoutes");
const registerpageRoute = require("./routes/registerpageRoutes");
const registeruserRoute = require("./routes/registeruser");
const loginpageRoute = require("./routes/loginpageRoute");
const makeloginRoute = require("./routes/authRoutes"); 
const dashboardRoute = require("./routes/dashboardRoute");


// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "Front-end", "Pages"));

// Servir CSS, JS, imagens
app.use(express.static(path.join(__dirname, "..", "Front-end")));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sincronizando banco
connection.sync({ alter: true })
  .then(() => console.log("Banco sincronizado"))
  .catch(console.error);

// Usando rotas
app.use("/", home); // rota principal
app.use("/profile", profileRouter); // rota privada
app.use("/registerpage", registerpageRoute); // rota de cadastro
app.use("/registeruser", registeruserRoute); // rota de cadastro de usuário
app.use("/loginpage", loginpageRoute); // rota de login page
app.use("/makelogin", makeloginRoute); // rota de login
//app.use("/dashboard", dashboardRoute); // rota do dashboard

// Servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
