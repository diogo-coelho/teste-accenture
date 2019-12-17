require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const load = require("express-load");

module.exports = () => {
    var app = express();
    app.set("port", process.env.PORT || 80);
    app.use(bodyParser.json());

    load('modelos', {
        cwd: process.env.NODE_ENV === "development" ? "app" : "build/app"
    })
    .then('recursos')
    .then('servicos')
    .then('rotas')
    .into(app);

    return app;
};