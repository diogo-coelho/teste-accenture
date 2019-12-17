const uri = "mongodb://localhost:27017/teste_accenture";
const path = require("path");
const application = require(path.join(__dirname, "build", "./configuracoes/express"))();
const mongoose = require(path.join(__dirname, "build", "./configuracoes/database"))(uri);

const server = application.listen(application.get("port"), () => {
    console.log(`Aplicação rodando na porta ${ application.get("port") }`);
})