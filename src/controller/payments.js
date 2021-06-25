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
exports.PaymentsController = void 0;
var paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
var connection_1 = require("../database/connection");
var uuid_1 = require("uuid");
var http_1 = require("../http");
var paypalConfig = require('../config/paypal.json');
paypal_rest_sdk_1.default.configure(paypalConfig);
var PaymentsController = /** @class */ (function () {
    function PaymentsController() {
    }
    PaymentsController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    PaymentsController.prototype.saveCart = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, products, date, id, user_1, cartAll_1, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, products = _a.products, date = _a.date;
                        console.log(req.userId);
                        id = req.userId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, connection_1.connection("users").where("id", id).first()];
                    case 2:
                        user_1 = _b.sent();
                        return [4 /*yield*/, connection_1.connection("cart_payments")];
                    case 3:
                        cartAll_1 = _b.sent();
                        if (cartAll_1.length !== 0) {
                            products.filter(function (item, i) { return __awaiter(_this, void 0, void 0, function () {
                                var tes;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            tes = cartAll_1[i];
                                            if (!tes) return [3 /*break*/, 2];
                                            if (!(item.name === cartAll_1[i].name)) return [3 /*break*/, 2];
                                            console.log('Update2');
                                            return [4 /*yield*/, connection_1.connection("cart_payments").where("user_id", id).where("sku", products[i].id).where("name", products[i].name).update({
                                                    name: products[i].name,
                                                    sku: products[i].id,
                                                    price: String(Number(products[i].price)),
                                                    date: date,
                                                    currency: "BRL",
                                                    quantity: String(products[i].quantity)
                                                })];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            if (!(tes === undefined)) return [3 /*break*/, 4];
                                            console.log('Create');
                                            return [4 /*yield*/, connection_1.connection("cart_payments").insert({
                                                    id: uuid_1.v4(),
                                                    user_id: user_1.id,
                                                    name: products[i].name,
                                                    sku: products[i].id,
                                                    price: String(Number(products[i].price)),
                                                    date: date,
                                                    currency: "BRL",
                                                    quantity: String(products[i].quantity)
                                                })];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        else {
                            console.log("Create_First");
                            products.forEach(function (product) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, connection_1.connection("cart_payments").insert({
                                                id: uuid_1.v4(),
                                                user_id: user_1.id,
                                                name: product.name,
                                                sku: product.id,
                                                price: String(Number(product.price)),
                                                date: date,
                                                currency: "BRL",
                                                quantity: String(product.quantity)
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/, res.send({ message: "Carrinho salvado." })];
                    case 4:
                        error_1 = _b.sent();
                        return [2 /*return*/, res.send({ error: error_1 })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.deleteCart = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.query.id;
                        console.log(id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, connection_1.connection("cart_payments").where("sku", String(id)).delete()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.send({ message: "Apagado com sucesso." })];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, res.send({ error: error_2 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.buy = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user, items, priceFinal_1, price, create_payment_json, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.query.id;
                        console.log(id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, connection_1.connection("users").where("id", String(id)).first()];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, res.send({ error: "Usuário não encontrado." })];
                        }
                        return [4 /*yield*/, connection_1.connection("cart_payments")
                                .where("user_id", String(id))
                                .select([
                                "cart_payments.name",
                                "cart_payments.sku",
                                "cart_payments.price",
                                "cart_payments.date",
                                "cart_payments.currency",
                                "cart_payments.quantity",
                            ])];
                    case 3:
                        items = _a.sent();
                        priceFinal_1 = 0;
                        items.forEach(function (item) {
                            priceFinal_1 = Number(Number(priceFinal_1) + Number(item.price));
                        });
                        price = priceFinal_1.toFixed(2);
                        create_payment_json = {
                            "intent": "sale",
                            "payer": {
                                "payment_method": "paypal"
                            },
                            "redirect_urls": {
                                "return_url": process.env.API_URL_PRODUCTION + "/auth/payment/success?id=" + id,
                                "cancel_url": process.env.API_URL_PRODUCTION + "/auth/payment/cancel"
                            },
                            "transactions": [{
                                    "item_list": {
                                        "items": [{
                                                "name": "item",
                                                "sku": "item",
                                                "price": parseFloat(price),
                                                "currency": "BRL",
                                                "quantity": 1
                                            }]
                                    },
                                    "amount": {
                                        "currency": "BRL",
                                        "total": parseFloat(price)
                                    },
                                    "description": "This is the payment description."
                                }]
                        };
                        return [4 /*yield*/, paypal_rest_sdk_1.default.payment.create(create_payment_json, function (err, payment) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    payment.links.forEach(function (link) {
                                        if (link.rel === 'approval_url')
                                            return res.redirect(link.href);
                                    });
                                }
                            })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        res.send({ error: error_3 });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.success = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, PayerID, paymentId, id, items_1, user_2, priceFinal_2, price, execute_payment_json, error_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.query, PayerID = _a.PayerID, paymentId = _a.paymentId, id = _a.id;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, connection_1.connection("cart_payments")
                                .where("user_id", String(id))
                                .select([
                                "cart_payments.name",
                                "cart_payments.sku",
                                "cart_payments.price",
                                "cart_payments.date",
                                "cart_payments.currency",
                                "cart_payments.quantity",
                            ])];
                    case 2:
                        items_1 = _b.sent();
                        return [4 /*yield*/, connection_1.connection("users").where("id", String(id)).first()];
                    case 3:
                        user_2 = _b.sent();
                        priceFinal_2 = 0;
                        items_1.forEach(function (item) {
                            priceFinal_2 = Number(Number(priceFinal_2) + Number(item.price));
                        });
                        price = priceFinal_2.toFixed(2);
                        execute_payment_json = {
                            "payer_id": PayerID,
                            "transactions": [{
                                    "amount": {
                                        "currency": "BRL",
                                        "total": parseFloat(price)
                                    }
                                }]
                        };
                        paypal_rest_sdk_1.default.payment.execute(String(paymentId), execute_payment_json, function (err, payment) { return __awaiter(_this, void 0, void 0, function () {
                            var itemsName, payments, save, ts, fs;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!err) return [3 /*break*/, 1];
                                        return [2 /*return*/, res.send({ err: err })];
                                    case 1:
                                        itemsName = items_1.filter(function (item) { return ({ name: item.name }); });
                                        return [4 /*yield*/, {
                                                "id": payment === null || payment === void 0 ? void 0 : payment.id,
                                                "user_id": String(id),
                                                "intent": payment === null || payment === void 0 ? void 0 : payment.intent,
                                                "state": payment === null || payment === void 0 ? void 0 : payment.state,
                                                "cart": payment === null || payment === void 0 ? void 0 : payment.cart,
                                                "payer": {
                                                    "payment_method": payment === null || payment === void 0 ? void 0 : payment.payer.payment_method,
                                                    "status": payment === null || payment === void 0 ? void 0 : payment.payer.status,
                                                    "payer_info": {
                                                        "email": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info,
                                                        "first_name": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info.first_name,
                                                        "last_name": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info.last_name,
                                                        "payer_id": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info.payer_id,
                                                        "shipping_address": {
                                                            "recipient_name": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info.shipping_address.recipient_name,
                                                            "line1": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info.shipping_address.line1,
                                                            "city": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info.shipping_address.city,
                                                            "state": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info.shipping_address.state,
                                                            "postal_code": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info.shipping_address.postal_code,
                                                            "country_code": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info.shipping_address.country_code,
                                                            "normalization_status": payment === null || payment === void 0 ? void 0 : payment.payer.payer_info.shipping_address.normalization_status
                                                        },
                                                        "tax_id_type": payment === null || payment === void 0 ? void 0 : payment.payer.tax_id_type,
                                                        "tax_id": payment === null || payment === void 0 ? void 0 : payment.payer.tax_id,
                                                        "country_code": payment === null || payment === void 0 ? void 0 : payment.payer.country_code
                                                    }
                                                },
                                                "transactions": [{
                                                        "amount": {
                                                            "total": payment === null || payment === void 0 ? void 0 : payment.transactions[0].amount.total,
                                                            "currency": payment === null || payment === void 0 ? void 0 : payment.transactions[0].amount.currency,
                                                            "details": {
                                                                "subtotal": payment === null || payment === void 0 ? void 0 : payment.transactions[0].amount.details.subtotal,
                                                                "shipping": payment === null || payment === void 0 ? void 0 : payment.transactions[0].amount.details.shipping,
                                                                "insurance": payment === null || payment === void 0 ? void 0 : payment.transactions[0].amount.details.insurance,
                                                                "handling_fee": payment === null || payment === void 0 ? void 0 : payment.transactions[0].amount.details.handling_fee,
                                                                "shipping_discount": payment === null || payment === void 0 ? void 0 : payment.transactions[0].amount.details.shipping_discount,
                                                                "discount": payment === null || payment === void 0 ? void 0 : payment.transactions[0].amount.details.discount
                                                            }
                                                        }
                                                    }],
                                                "date": items_1[0].date,
                                                "create_time": payment === null || payment === void 0 ? void 0 : payment.create_time,
                                                "update_time": payment === null || payment === void 0 ? void 0 : payment.update_time,
                                            }];
                                    case 2:
                                        payments = _a.sent();
                                        save = {
                                            "id": payments.id,
                                            "user_id": payments.user_id,
                                            "intent": payments.intent,
                                            "state": payments.state,
                                            "cart": payments.cart,
                                            "status": "pendente",
                                            "date": payments.date,
                                            "payer": JSON.stringify(payments.payer),
                                            "transactions": JSON.stringify(payments.transactions),
                                            "telphone": user_2.telphone,
                                            "products": JSON.stringify(itemsName),
                                            "create_time": payments.create_time,
                                            "update_time": payments.update_time,
                                        };
                                        return [4 /*yield*/, connection_1.connection("payments").where("id", payment === null || payment === void 0 ? void 0 : payment.id).first()];
                                    case 3:
                                        if (!!(_a.sent())) return [3 /*break*/, 5];
                                        return [4 /*yield*/, connection_1.connection("payments").insert(save)];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5: return [4 /*yield*/, connection_1.connection("payments").where("id", payment === null || payment === void 0 ? void 0 : payment.id).first()];
                                    case 6:
                                        ts = _a.sent();
                                        fs = {
                                            "id": ts.id,
                                            "user_id": ts.user_id,
                                            "intent": ts.intent,
                                            "state": ts.state,
                                            "status": ts.status,
                                            "date": ts.date,
                                            "products": ts.products,
                                            "cart": ts.cart,
                                            "telphone": user_2.telphone,
                                            "payer": JSON.parse(ts.payer),
                                            "transactions": JSON.parse(ts.transactions),
                                            "create_time": ts.create_time,
                                            "update_time": ts.update_time,
                                        };
                                        http_1.io.emit('newRequest', fs);
                                        return [2 /*return*/, res.redirect(process.env.API_URL_DOMAIN + "payment_success/" + fs.id)];
                                }
                            });
                        }); });
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _b.sent();
                        return [2 /*return*/, res.send({ error: error_4 })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.cancel = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.redirect("" + process.env.API_URL_DOMAIN);
                res.json({ message: "Ok" });
                return [2 /*return*/];
            });
        });
    };
    PaymentsController.prototype.payments = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var request, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection_1.connection("payments")];
                    case 1:
                        request = _a.sent();
                        return [2 /*return*/, res.send(request)];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, res.send({ error: error_5 })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.userPayment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userPayments, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, connection_1.connection("payments").where("user_id", String(id))];
                    case 2:
                        userPayments = _a.sent();
                        return [2 /*return*/, res.send(userPayments)];
                    case 3:
                        error_6 = _a.sent();
                        return [2 /*return*/, res.send({ error: error_6 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return PaymentsController;
}());
exports.PaymentsController = PaymentsController;
