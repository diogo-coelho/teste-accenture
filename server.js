require('dotenv').config();
const path = require("path");
const application = require(path.join(__dirname, "build", "./configuracoes/express"))();
const mongoose = require(path.join(__dirname, "build", "./configuracoes/database"))(process.env.DB_HOST);

const server = application.listen(application.get("port"), () => {
    console.log(`Aplicação rodando na porta ${ application.get("port") }`);
})