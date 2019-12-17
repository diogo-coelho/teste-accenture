const express = require('express');

module.exports = () => {
    var app = express();
    app.set("port", process.env.PORT || 80);

    return app;
};