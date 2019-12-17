var mongoose = require("mongoose");

module.exports = () => {
    var schema = mongoose.Schema({
        nome: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            index: {
                unique: true
            }
        },
        senha: {
            type: String,
            require: true
        },
        telefones: [
            {
                numero: {
                    type: String,
                    require: true
                },
                ddd: {
                    type: String,
                    require: true
                }
            }
        ],
        data_criacao: {
            type: Date,
            require: true
        },
        data_atualizacao: {
            type: Date,
        },
        ultimo_login: {
            type: Date,
            require: true
        },
        token: {
            type: String
        }
    });

    return mongoose.model('Usuario', schema, 'usuario');
};