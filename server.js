const uri = "mongodb://142.93.246.103:27017/desafio_concrete";
const path = require("path");
const application = require(path.join(__dirname, "build", "./configuracoes/express"))();
const 

const server = application.listen(application.get("port"), () => {
    console.log(`Aplicação rodando na porta ${ application.get("port") }`);
})