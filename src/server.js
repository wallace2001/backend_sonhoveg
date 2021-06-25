"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
http_1.server.listen(process.env.PORT || 3002, function () { return console.log('Conectado'); });
