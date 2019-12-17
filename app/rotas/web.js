var auth = require('../../configuracoes/auth')();

module.exports = app => {
    var usuarioRecurso = app.recursos.UsuarioRecurso;
    app.post('/usuario/signup', usuarioRecurso.criar);
    app.post('/usuario/signin', usuarioRecurso.logar);
    app.get('/usuario/search/:id', auth.authenticate(), usuarioRecurso.buscar);

    app.get('/usuario/unauthorized', function (req, res) {
        res.status(401).json({"mensagem":"Não autorizado"});
    });

    app.all('*', function (req, res) {
        res.status(404).json({"mensagem":"Serviço não encontrado"});
    });
};