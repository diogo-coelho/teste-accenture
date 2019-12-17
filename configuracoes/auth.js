require("dotenv").config();
const passport = require('passport');
const passportJWT = require('passport-jwt');
const mongoose = require('mongoose');
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const parametros = {
    secretOrKey: process.env.AUTH_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = () => {
    var estrategia = new Strategy(parametros, function (payload, done) {
        var Usuario = mongoose.models.Usuario;
        Usuario.findById(payload._id).exec().then(usuario => {
            if (usuario) {
                return done(null, usuario);
            } else {
                return done(null, false);
            }
        });
    });
    passport.use("jwt", estrategia);

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", { failureRedirect: '/usuario/unauthorized', session: false });
        }
    };
}