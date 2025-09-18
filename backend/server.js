const express = require("express"); 
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const connection = require("./database/connection");

// Importando rotas
const home = require("./routes/home");
const profileRouter = require("./routes/profileRoutes");
const authRouter = require("./routes/authRoutes");


app.use(express.static(path.join(__dirname, '..', '..',"Front-end","Styles"))); // Define a pasta dos nossos css (não apagar )

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
app.use("/auth", authRouter); // rota de login

// Servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});