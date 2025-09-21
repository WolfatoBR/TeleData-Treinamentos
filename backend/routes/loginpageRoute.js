const express = require("express");
const router = express.Router();


router.get("/",(req,res)=>{
    res.render("Login"); // Renderiza minha pagina de login
})


module.exports = router;