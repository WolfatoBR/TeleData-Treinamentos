const express = require ("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../database/models/user")

router.post("/registeruser",async(req,res)=>{

    const username = req.body.name
    const useremail = req.body.email
    const userpassword = req.body.password


    if (!username || !useremail || !userpassword){
        return res.status(400).send("Preencha Todos Os Campos")
    }

    const rounds = 12
    const hashed_password = await bcrypt.hash(userpassword,rounds);

    
    const newUser = await User.create({

        full_name:username,
        email:useremail,
        password:hashed_password

    })
    res.redirect("/") // Redireciona para minha rota home
    
})

module.exports = router;