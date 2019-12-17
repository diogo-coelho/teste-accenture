function validaNome(nome) {
    var reg = new RegExp(/^[A-Za-z]{3,}/g);
    if (typeof(nome) === "string" && reg.test(nome)){
        return true;
    }

    return false;
};

function validaEmail (email) {
    var reg = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
    if (typeof(email) === "string" && reg.test(email)){
        return true;
    }

    return false;
};

function validaSenha (senha) {
    var reg = new RegExp(/^[A-Za-z0-9_!?\-\.&%()+=$#@\\\/*\'\"]{4,12}/g);
    if (typeof(senha) === "string" && reg.test(senha)){
        return true;
    }

    return false;
};

function validaTelefones (telefones){
    if (Array.isArray(telefones) && telefones.length > 0){
        for (var telefone of telefones){
            if (typeof telefone != "object" || Object.keys(telefone).length === 0){
                return false;
            }
            
            if (!telefone.hasOwnProperty('numero') 
                || !telefone.hasOwnProperty('ddd')) {
                return false;
            }
            
            var regNumero = new RegExp(/^\d{8,9}/g);
            var regDigito = new RegExp(/^\d{2}/g);
            if (!regNumero.test(telefone.numero) || !regDigito.test(telefone.ddd)){
                return false;
            }
        }

        return true;
    } else {
        return false;
    }
};

module.exports = { validaNome, validaEmail, validaSenha, validaTelefones };