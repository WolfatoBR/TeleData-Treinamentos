const express =  require("express"); // Cria uma instancia do express 
const app = express() 
const port = 3001
const path = require("path") 
const bodyParser = require("body-parser")
const connection = require("./database/connection")


// Importando o body parser
app.use(bodyParser.json()) // para JSON
app.use(bodyParser.urlencoded({ extended: true })) // para dados de formulário


const homeRouter = require("./routes/home") // Importando a rota do meu home.
const registerRouter = require("./routes/registeruser") // Importa a rota do meu registro.


connection.sync({ force: true }) // ou { force: true } para resetar tabelas
  .then(() => {
    console.log("Banco sincronizado")
  })
  .catch(console.error)



app.use("/",homeRouter) // usando minha rota pra teste
app.use("/registeruser",registerRouter)



app.listen(port,()=>{

    console.log("Servidor Rodando!")

})