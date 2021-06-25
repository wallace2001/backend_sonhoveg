"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmails = void 0;
var connection_1 = require("../database/connection");
var mailerCreate_1 = require("../mail/mailerCreate");
var uuid_1 = require("uuid");
var SendEmails = /** @class */ (function () {
    function SendEmails() {
    }
    SendEmails.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, toEmail, hmtl, title, mailerCreate, user, message, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.userId;
                        _a = req.body, toEmail = _a.toEmail, hmtl = _a.hmtl, title = _a.title;
                        mailerCreate = new mailerCreate_1.MailerCreate();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, connection_1.connection("users").where("id", id).first()];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.send({ error: "Usuário não existe." })];
                        }
                        if (!user.admin) {
                            return [2 /*return*/, res.send({ error: "Usuário não identificado como administrador." })];
                        }
                        message = {
                            from: process.env.USERNAME_HOST,
                            to: toEmail,
                            subject: "" + title,
                            // text: "Clique no botão abaixo",
                            html: "" + hmtl
                        };
                        return [4 /*yield*/, mailerCreate.send({
                                message: message
                            })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        res.send({ error: error_1 });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SendEmails.prototype.sendEmail = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mailerReceive, title, description, id, mailerCreate, user, users, usersEmail_1, mailer, email, message, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, mailerReceive = _a.mailerReceive, title = _a.title, description = _a.description;
                        id = req.userId;
                        console.log(mailerReceive, title, description);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        mailerCreate = new mailerCreate_1.MailerCreate();
                        return [4 /*yield*/, connection_1.connection("users").where("id", id).first()];
                    case 2:
                        user = _b.sent();
                        return [4 /*yield*/, connection_1.connection("users")];
                    case 3:
                        users = _b.sent();
                        usersEmail_1 = [];
                        return [4 /*yield*/, connection_1.connection("users").where("id", id).first()];
                    case 4:
                        mailer = _b.sent();
                        if (!mailerReceive) {
                            users.map(function (item) { return usersEmail_1.push(item.email); });
                        }
                        if (!user) {
                            return [2 /*return*/, res.send({ error: "Usuário inexistente" })];
                        }
                        email = {
                            id: uuid_1.v4(),
                            email: mailer,
                            mailerSend: user.email,
                            title: title,
                            description: description
                        };
                        message = {
                            from: process.env.USERNAME_HOST,
                            to: !mailer ? __spreadArray([], usersEmail_1) : mailer,
                            subject: "" + title,
                            // text: "Clique no botão abaixo",
                            html: "" + description
                        };
                        return [4 /*yield*/, mailerCreate.send({
                                message: message
                            })];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, res.send(message)];
                    case 6:
                        error_2 = _b.sent();
                        return [2 /*return*/, res.send({ error: error_2 })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return SendEmails;
}());
exports.SendEmails = SendEmails;
