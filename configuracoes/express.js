const express = require('express');

module.exports = () => {
    "use strict";

    var app = express();
    app.set("port", process.env.PORT || 80);

    return app;
}