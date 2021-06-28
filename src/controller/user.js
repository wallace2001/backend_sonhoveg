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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser = void 0;
var connection_1 = require("../database/connection");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mailerCreate_1 = require("../mail/mailerCreate");
var generateToken = function (params) {
    if (params === void 0) { params = {}; }
    return jsonwebtoken_1.default.sign(params, process.env.SECRET_TOKEN, {
        expiresIn: 86400
    });
};
var CreateUser = /** @class */ (function () {
    function CreateUser() {
    }
    CreateUser.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, email, password, date, telphone, sex, admin, mailerCreate, passwordEncripted, emailAlreadyExists, data, createUser, idUserNow, token, message, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, email = _a.email, password = _a.password, date = _a.date, telphone = _a.telphone, sex = _a.sex, admin = _a.admin;
                        mailerCreate = new mailerCreate_1.MailerCreate();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 2:
                        passwordEncripted = _b.sent();
                        return [4 /*yield*/, connection_1.connection("users").where({
                                email: String(email).toLowerCase()
                            }).select('email').first()];
                    case 3:
                        emailAlreadyExists = _b.sent();
                        if (emailAlreadyExists)
                            return [2 /*return*/, res.json({ error: "E-mail já cadastrado." })];
                        data = {
                            name: name,
                            email: String(email).toLowerCase(),
                            telphone: telphone,
                            year: date,
                            sex: sex === '1' ? 'Masculino' : sex === '2' ? 'Feminino' : 'NoN',
                            password: passwordEncripted,
                            admin: false
                        };
                        return [4 /*yield*/, connection_1.connection("users").insert(data)];
                    case 4:
                        createUser = _b.sent();
                        return [4 /*yield*/, connection_1.connection("users").where({
                                email: email
                            }).select("id").first()];
                    case 5:
                        idUserNow = _b.sent();
                        token = generateToken({
                            id: idUserNow
                        });
                        message = {
                            from: process.env.USERNAME_HOST,
                            to: email,
                            subject: "Olá, Confirme seu e-mail para finalizar seu cadastro.",
                            text: "Clique no botão abaixo",
                            html: "\n                    <h2>Ol\u00E1 " + name + ", Para continuar no site \u00E9 preciso que voc\u00EA confirme sua conta.</h2>\n                    <a href=" + process.env.API_URL_PRODUCTION + "confirmaccout/id=" + idUserNow.id + "&token=" + token + ">Confirmar conta</a>\n                "
                        };
                        return [4 /*yield*/, mailerCreate.send({
                                message: message
                            })];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, res.json({ createUser: createUser, token: token, status: true })];
                    case 7:
                        error_1 = _b.sent();
                        res.send({ error: error_1 });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CreateUser.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, account, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, connection_1.connection("users").where({
                                email: email
                            }).first()];
                    case 2:
                        account = _b.sent();
                        if (!(account === null || account === void 0 ? void 0 : account.email)) {
                            res.json({ error: "Conta não existe!" });
                        }
                        if (!(account === null || account === void 0 ? void 0 : account.confirmAccount)) {
                            return [2 /*return*/, res.json({ error: "Conta não confirmada" })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, account === null || account === void 0 ? void 0 : account.password)];
                    case 3:
                        if (!(_b.sent())) {
                            return [2 /*return*/, res.json({ error: "Senha inválida" })];
                        }
                        res.json({
                            account: account,
                            token: generateToken({ id: account.id })
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        console.log({ error: error_2 });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CreateUser.prototype.showConfirm = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, token, user, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, id = _a.id, token = _a.token;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, connection_1.connection("users").where("id", id.substring(1)).first()];
                    case 2:
                        user = _b.sent();
                        if (user.confirmAccount) {
                            return [2 /*return*/, res.redirect('https://sonhoveg.com/')];
                        }
                        return [4 /*yield*/, connection_1.connection("users").where("id", id.substring(1)).update({
                                confirmAccount: true
                            })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, res.redirect('https://sonhoveg.com/')];
                    case 4:
                        error_3 = _b.sent();
                        console.log({ error: error_3 });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CreateUser.prototype.user = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection_1.connection("users").where("id", req.userId).first()];
                    case 1:
                        user = _a.sent();
                        res.json({
                            ok: true,
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            admin: user.admin,
                            sex: user.sex,
                            telphone: user.telphone
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, res.send({ error: error_4 })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateUser.prototype.listUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.connection("users")];
                    case 1:
                        user = _a.sent();
                        try {
                            return [2 /*return*/, res.send(user)];
                        }
                        catch (error) {
                            return [2 /*return*/, res.send({ error: error })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateUser.prototype.change = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, mailerCreate, message, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection_1.connection("users")
                            .where('id', String(req.userId))
                            .first()];
                    case 1:
                        user = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        if (!user) {
                            return [2 /*return*/, res.json({ error: "Usuário não encontrado." })];
                        }
                        mailerCreate = new mailerCreate_1.MailerCreate();
                        message = {
                            from: process.env.USERNAME_HOST,
                            to: user.email,
                            subject: "Mudar senha",
                            text: "Clique no botão abaixo",
                            html: "\n                    <h2>Ol\u00E1 " + user.name + ", Clique no bot\u00E3o para mudar sua senha.</h2>\n                    <a href=" + process.env.API_URL_PRODUCTION + "change_password/" + user.id + ">Mudar senha</a>\n                "
                        };
                        return [4 /*yield*/, mailerCreate.send({
                                message: message
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        return [2 /*return*/, res.json({ error: error_5 })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CreateUser.prototype.changePassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                id = req.params.id;
                try {
                }
                catch (error) {
                    return [2 /*return*/, res.json({ error: error })];
                }
                return [2 /*return*/, res.json({ id: id })];
            });
        });
    };
    CreateUser.prototype.changePass = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, password, passwordRepeat, trx, passwordEncripted, userBefore, user, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.query.id;
                        _a = req.body, password = _a.password, passwordRepeat = _a.passwordRepeat;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        if (password !== passwordRepeat) {
                            return [2 /*return*/, res.json({ error: "Senhas não são iguais." })];
                        }
                        return [4 /*yield*/, connection_1.connection.transaction()];
                    case 2:
                        trx = _b.sent();
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 3:
                        passwordEncripted = _b.sent();
                        userBefore = trx('users')
                            .where('id', String(id))
                            .first();
                        return [4 /*yield*/, trx('users')
                                .where('id', String(id))
                                .first()
                                .update({
                                password: passwordEncripted
                            })];
                    case 4:
                        user = _b.sent();
                        return [4 /*yield*/, trx.commit()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, res.json({ message: "Senha atualizada..." })];
                    case 6:
                        error_6 = _b.sent();
                        return [2 /*return*/, res.json({ error: error_6 })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    CreateUser.prototype.accountRecuperation = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, mailerCreate, user, message, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = req.query.email;
                        console.log(email);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        mailerCreate = new mailerCreate_1.MailerCreate();
                        return [4 /*yield*/, connection_1.connection('users')
                                .where('email', String(email))
                                .first()];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, res.json({ error: "Usuário não cadastrado." })];
                        }
                        message = {
                            from: process.env.USERNAME_HOST,
                            to: user.email,
                            subject: "Mudar senha",
                            text: "Clique no botão abaixo",
                            html: "\n                    <h2>Ol\u00E1 " + user.name + ".</h2>\n                    <h4>Clique no bot\u00E3o abaixo para mudar sua senha.</h4>\n                    <a href=" + process.env.API_URL_PRODUCTION + "change_password/" + user.id + ">Mudar senha</a>\n                "
                        };
                        return [4 /*yield*/, mailerCreate.send({
                                message: message
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_7 = _a.sent();
                        return [2 /*return*/, res.json({ error: error_7 })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return CreateUser;
}());
exports.CreateUser = CreateUser;
