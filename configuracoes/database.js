var mongoose = require("mongoose");

module.exports = uri => {   
    mongoose.set("useCreateIndex");
    mongoose.connect(uri, {
        useNewUrlParser: true,
        keepAlive: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    mongoose.connection.on(`connected`, () => {
        console.log(`Conectado ao MongoDB: ${ uri }`);
    });

    mongoose.connection.on(`disconnected`, () => {
        console.log(`Desconectado do MongoDB: ${ uri }`);
    });

    mongoose.connection.on(`error`, () => {
        if (err) throw new Error(err);
        console.log(`Ocorreu um erro no MongoDB: ${ uri }`);
        console.log(err);
    });

    process.on(`SIGNIT`, () => {
        mongoose.connection.close(() => {
            console.log(`Conexão com o MongoDB encerrada`);
            process.exit(0);
        });
    });
};