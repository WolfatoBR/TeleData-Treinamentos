const express = require("express");
const router = express.Router();
const registerRoute = require("./registerpageRoutes"); //importando rota da pagina de cadastro

router.get("/", (req, res) => {
  res.render("homePage"); // já vai procurar em /Front-end/Pages/homePage.ejs
});




module.exports = router;
