require("dotenv").config();
const hash_password = require('password-hash');
const moment = require('moment');
const jwt = require('jwt-simple');

module.exports = (app) => {
    const usuarioRecurso = {
        criar: async (req, res) => {
            try {
                // Instancia módulo de validação dos parâmetros de entrada
                var ValidaParametros = app.modelos.ValidaParametros;
                // Verifica se os parâmetros foram passados corretamente,
                // senão retorna o JSON com a mensagem de erro
                if (!ValidaParametros.validaNome(req.body.nome)
                    || !ValidaParametros.validaEmail(req.body.email)
                    || !ValidaParametros.validaSenha(req.body.senha)
                    || !ValidaParametros.validaTelefones(req.body.telefones)) {
                        res.status(400).json({ "mensagem": "Parâmetros incorretos" });
                } else {
                    // Configura as variáveis
                    var nome = req.body.nome;
                    var email = req.body.email;
                    var senha = hash_password.generate(req.body.senha);
                    var telefones = req.body.telefones;

                    // Instancia o serviço de usuário
                    var usuarioServico = app.servicos.UsuarioServico;
                    var emailExistente = await usuarioServico.encontraUsuarioPeloEmail(email).then((retorno) => {
                        // Verifica se o email já existe no banco de dados
                        return retorno;
                    });

                    // Verifica se o email informado já existe no banco de dados
                    if (emailExistente) {
                        // Enviando resposta com o erro já que o email já existe no BD
                        res.status(400).json({ "mensagem": "Email já existente" });
                    } else {
                        usuarioServico.cadastraUsuario(nome, email, senha, telefones).then((usuarioCadastrado) => {
                            if (!usuarioCadastrado) throw new Error(`Não foi possível cadastrar o usuário`);
                            
                            var payload = { _id: usuarioCadastrado._id };
                            var token = jwt.encode(payload, process.env.AUTH_SECRET);                                    
                            var parametros = { token: token };

                            // Insere o valor do token no objeto Usuário
                            usuarioServico.atualizaUsuario(usuarioCadastrado._id, parametros).then((usuario) => {
                                if (usuario) {
                                    // Enviando a resposta com o JSON de resposta com o usuário criado
                                    res.status(201).json({
                                        "id": usuario._id,
                                        "nome": usuario.nome,
                                        "email": usuario.email,
                                        "senha": usuario.senha,
                                        "telefones": usuario.telefones,
                                        "data_criacao": moment(usuario.data_criacao).format('DD-MM-YYYY HH:mm:ss'),
                                        "data_atualizacao": moment(usuario.data_atualizacao).format('DD-MM-YYYY HH:mm:ss'),
                                        "ultimo_login": moment(usuario.ultimo_login).format('DD-MM-YYYY HH:mm:ss'),
                                        "token": usuario.token
                                    });
                                } else {
                                    // Enviando resposta com o erro 500 e mensagem de erro
                                    throw new Error(`Ocorreu um erro no cadastro`);
                                }
                            });
                        });
                    }
                }
                
            } catch (err) {
                console.log(err);
                res.status(500).json({ "mensagem": "Ocorreu um erro de servidor" });
            }
        },
        logar: async (req, res) => {
            try {
                // Instancia módulo de validação dos parâmetros de entrada
                var ValidaParametros = app.modelos.ValidaParametros;
                // Valida os parâmetros passados 
                if (!ValidaParametros.validaEmail(req.body.email)
                    && !ValidaParametros.validaSenha(req.body.senha)) {
                    res.status(400).json({ "mensagem": "Parâmetros incorretos" });
                }

                // Instancia as variáveis
                var email = req.body.email;
                var senha = req.body.senha;

                // Instancia o serviço
                var usuarioServico = app.servicos.UsuarioServico;
                usuarioServico.encontraUsuarioPeloEmail(email).then((usuarioEncontrado) => {
                    if (!usuarioEncontrado) {
                        // Email não encontrado / Usuário não autorizado
                        res.status(401).json({"mensagem":"Usuário e/ou senha inválidos"});
                    } else {
                        // Verifica se o hash de senhas conferem entre si
                        if (hash_password.verify(senha, usuarioEncontrado.senha)){
                            var payload = { _id: usuarioEncontrado._id };
                            var token = jwt.encode(payload, process.env.AUTH_SECRET);
                            // Passa os parâmetros que serão atualizados no BD
                            var parametros = {
                                token: token,
                                data_atualizacao: moment(Date().now).format('YYYY-MM-DD HH:mm:ss'),
                                ultimo_login: moment(Date().now).format('YYYY-MM-DD HH:mm:ss')
                            };

                            usuarioServico.atualizaUsuario(usuarioEncontrado._id, parametros).then((usuario) => {
                                if (!usuario) throw new Error(`Ocorreu um erro ao realizar a atualização`);
                                // Enviando a resposta com o JSON
                                res.status(200).json({
                                    "id": usuario._id,
                                    "nome": usuario.nome,
                                    "email": usuario.email,
                                    "senha": usuario.senha,
                                    "telefones": usuario.telefones,
                                    "data_criacao": moment(usuario.data_criacao).format('DD-MM-YYYY HH:mm:ss'),
                                    "data_atualizacao": moment(usuario.data_atualizacao).format('DD-MM-YYYY HH:mm:ss'),
                                    "ultimo_login": moment(usuario.ultimo_login).format('DD-MM-YYYY HH:mm:ss'),
                                    "token": usuario.token
                                });
                            });
                        } else {
                            // Email não encontrado / Usuário não autorizado
                            res.status(401).json({"mensagem":"Usuário e/ou senha inválidos"});
                        }
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({ "mensagem": "Ocorreu um erro de servidor" });
            }
        },
        buscar: async (req, res) => {
            try {
                // Verifica se o parâmetro de id foi passado corretamente no caminho da URL
                if (req.params.id){
                    // Instancia as variáveis
                    var id = req.params.id;
                    var token_autorizacao = req.headers.authorization.replace('Bearer ','');

                    // Instancia o serviço
                    var usuarioServico = app.servicos.UsuarioServico;
                    usuarioServico.encontraUsuarioPeloId(id).then((usuario) => {
                        if (!usuario) throw new Error(`Nenhum usuário encontrado`);

                        // Verifica se o token passado na requisição
                        // e o token encontrado no BD são idênticos
                        if (token_autorizacao == usuario.token) {
                            // Verifica se o último login foi efetuado 
                            // há mais de 30 minutos
                            if (usuario.ultimo_login.getTime() + 1800000 >= new Date().getTime()){
                                // Enviando status de sucesso com a resposta em JSON
                                res.status(200).json({
                                    "id": usuario._id,
                                    "nome": usuario.nome,
                                    "email": usuario.email,
                                    "senha": usuario.senha,
                                    "telefones": usuario.telefones,
                                    "data_criacao": moment(usuario.data_criacao).format('DD-MM-YYYY HH:mm:ss'),
                                    "data_atualizacao": moment(usuario.data_atualizacao).format('DD-MM-YYYY HH:mm:ss'),
                                    "ultimo_login": moment(usuario.ultimo_login).format('DD-MM-YYYY HH:mm:ss'),
                                    "token": usuario.token
                                });
                            } else {
                                // Último login efetuado a mais de 30 minutos / Sessão inválida
                                res.status(401).json({"mensagem":"Sessão inválida"});
                            }

                        } else {
                            // Tokens não conferem / Usuário não autorizado
                            res.status(401).json({"mensagem":"Não autorizado"});
                        }
                    });
                } else {
                    // Enviando resposta com status de erro para parâmetros incorretos
                    res.status(400).json({"mensagem":"Parâmetros incorretos"});
                }
            } catch (err) {
                console.log(err);
                res.status(500).json({ "mensagem": "Ocorreu um erro de servidor" });
            }
        }
    };

    return usuarioRecurso;
};