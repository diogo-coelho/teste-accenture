const assert = require('assert');
const chai = require('chai');
let chaiHttp = require('chai-http');
const server = require("../server");

chai.use(chaiHttp);

// ------------------- Criar Usuário -------------------- //
describe('usuarioRecurso', () => {
    describe('função de criação de Usuário', () => {
        // ----------------------------------------------------------------
        // Testes sobre os parâmetros passados pelo usuário para cadastro
        // ----------------------------------------------------------------

        it('Se todos os campos estiverem vazios, retorna status 400', (done) => {
            chai.request(server)
            .post('/usuario/signup')
            .set('content-type', 'application/json')
            .send({body: ""})
            .end(
                (err, res) => {
                    assert.equal(res.statusCode, 400);
                    assert.equal(res.body.mensagem, 'Parâmetros incorretos');
                done();
            });
        });

        it('Se o campo telefones não for um array, retorna erro', (done)  => {
            let object = {
                nome: "Diogo Coelho",
                email: "diogo.coelho@email.com",
                senha: "123456",
                telefones: { numero: "9999-9999", ddd: "11"}
            }

            chai.request(server)
            .post('/usuario/signup')
            .set('content-type', 'application/json')
            .send({body: JSON.stringify(object)})
            .end(
                (err, res) => {
                    assert.equal(res.statusCode, 400);
                    assert.equal(res.body.mensagem, 'Parâmetros incorretos');
                done();
            });
        });

        it('Se o campo telefones for um array vazio, retorna erro', (done) => {
            let object = {
                nome: "Diogo Coelho",
                email: "diogo.coelho@email.com",
                senha: "123456",
                telefones: []
            }

            chai.request(server)
            .post('/usuario/signup')
            .set('content-type', 'application/json')
            .send({body: JSON.stringify(object)})
            .end(
                (err, res) => {
                    assert.equal(res.statusCode, 400);
                    assert.equal(res.body.mensagem, 'Parâmetros incorretos');
                done();
            });
        });

        it('Se o email já existir, retornar erro com status 400', (done) => {
            let object = {
                nome: "Diogo Coelho",
                email: "diogo.coelho@teste.com",
                senha: "123456",
                telefones: [ { numero: "9999-9999", ddd: "11" } ]
            }

            chai.request(server)
            .post('/usuario/signup')
            .set('content-type', 'application/json')
            .send({body: JSON.stringify(object)})
            .end(
                (err, res) => {
                    console.log(res);
                    assert.equal(res.statusCode, 400);
                    assert.equal(res.body.mensagem, 'Email já existente');
                done();
            });
        });

        it('Se os campos forem passados de forma correta, retorna o usuário', (done) => {
            let object = {
                nome: "Novo Usuário",
                email: "novo.usuario@teste.com",
                senha: "123456",
                telefones: [ { numero: "9999-9999", ddd: "11" } ]
            }

            chai.request(server)
            .post('/usuario/signup')
            .set('content-type', 'application/json')
            .send(JSON.stringify(object))
            .end(
                (err, res) => {
                    assert.equal(res.statusCode, 201);
                done();
            });
        });

        // ----------------------------------------------------------------
        // Testes sobre os parâmetros passados pelo usuário para login
        // ----------------------------------------------------------------

        it('Se o email e senha estiverem errados, retorna erro 401', (done) => {
            let object = {
                email: "email.errado@teste.com",
                senha: "Senha Errada"
            }

            chai.request(server)
            .post('/usuario/signin')
            .set('content-type', 'application/json')
            .send(JSON.stringify(object))
            .end(
                (err, res) => {
                    assert.equal(res.statusCode, 401);
                    assert.equal(res.body.mensagem, 'Usuário e/ou senha inválidos');
                done();
            });
        });

        it('Se o email estiver certo e a senha errada, retorna erro 401', (done) => {
            let object = {
                email: "diogo.coelho@teste.com",
                senha: "Senha Errada"
            }

            chai.request(server)
            .post('/usuario/signin')
            .set('content-type', 'application/json')
            .send(JSON.stringify(object))
            .end(
                (err, res) => {
                    assert.equal(res.statusCode, 401);
                    assert.equal(res.body.mensagem, 'Usuário e/ou senha inválidos');
                done();
            });
        });

        it('Se o email estiver errado e a senha certa, retorna erro 401', (done) => {
            let object = {
                email: "email.errado@teste.com",
                senha: "123456"
            }

            chai.request(server)
            .post('/usuario/signin')
            .set('content-type', 'application/json')
            .send(JSON.stringify(object))
            .end(
                (err, res) => {
                    assert.equal(res.statusCode, 401);
                    assert.equal(res.body.mensagem, 'Usuário e/ou senha inválidos');
                done();
            });
        });

        it('Se ambos estiverem certos, retorna status 200', async () => {
            let object = {
                email: "diogo.coelho@teste.com",
                senha: "123456"
            }

            chai.request(server)
            .post('/usuario/signin')
            .set('content-type', 'application/json')
            .send(JSON.stringify(object))
            .end(
                (err, res) => {
                    assert.equal(res.statusCode, 200);
                done();
            });
        });
    });    
});
