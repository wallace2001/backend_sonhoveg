"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
module.exports = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader)
        return res.send({ error: "No token provided!" });
    var parts = authHeader.split(' ');
    if (parts.length !== 2)
        return res.send({ error: "Token invalid!" });
    var scheme = parts[0], token = parts[1];
    if (!/^Bearer$/i.test(scheme))
        return res.send({ error: "Token malformatted!" });
    jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN, function (err, decoded) {
        if (err)
            return res.send({ error: "Token invalid" });
        req.userId = decoded.id;
        return next();
    });
};
