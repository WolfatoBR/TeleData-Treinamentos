const Sequelize = require("sequelize");


const connection =  new Sequelize ("usuarios","root","root",({

    host: "localhost", // Coloque o host 
    dialect:"mysql", // o dialeto do banco , no caso mysql.
    port:"3306" //Coloca porta 


}))



module.exports =  connection;