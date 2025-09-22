const express = require('express');
const indexRoutes = require('./index'); // Arquivo de rotas principal
const app = express();




app.use('/', indexRoutes);