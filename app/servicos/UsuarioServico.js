const moment = require('moment');

module.exports = app => {
    const usuarioServico = {
        cadastraUsuario: (nome, email, senha, telefones) => {
            // Serviço de cadastro de novos clientes
            try {
                var Usuario = app.modelos.Usuario;
                return new Promise ((resolve, reject) => {
                    Usuario.create({
                        nome: nome,
                        email: email,
                        senha: senha,
                        telefones: telefones,
                        data_criacao: moment(Date().now).format('YYYY-MM-DD HH:mm:ss'),
                        data_atualizacao: moment(Date().now).format('YYYY-MM-DD HH:mm:ss'),
                        ultimo_login: moment(Date().now).format('YYYY-MM-DD HH:mm:ss')
                    }, function (err, usuario) {
                        if (err) {
                            throw new Error(err);                          
                        }

                        return resolve(usuario);
                    });
                }); 
            } catch (err) {
                throw new Error (err);
            }
        },
        encontraUsuarioPeloId: (id) => {
            try {
                var Usuario = app.modelos.Usuario;
                return new Promise ((resolve, reject) => {
                    Usuario.findById(id).exec().then((usuario) => {
                        return resolve(usuario);
                    });
                });               
            } catch (err) {
                throw new Error (err);
            }
        },
        encontraUsuarioPeloEmail: (email) => {
            try {
                var Usuario = app.modelos.Usuario;
                return new Promise ((resolve, reject) => {
                    Usuario.findOne({ email: email }).exec().then((usuario) => {
                        return resolve(usuario);
                    });
                });
            } catch (err) {
                throw new Error (err);
            }          
        },
        atualizaUsuario: (usuario_id, parametros) => {
            try {
                var Usuario = app.modelos.Usuario;
                return new Promise ((resolve, reject) => {
                    Usuario.findByIdAndUpdate(usuario_id, parametros, {new: true}, function (err, usuario) {
                        if (err) {
                            throw new Error(err);                           
                        }
                        return resolve(usuario);
                    });
                });              
            } catch (err) {
                throw new Error (err);
            }
        }
    };

    return usuarioServico;
};