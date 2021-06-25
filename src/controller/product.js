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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
var connection_1 = require("../database/connection");
var uuid_1 = require("uuid");
var ProductController = /** @class */ (function () {
    function ProductController() {
    }
    ProductController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, price, description, category, calories, image, slug, trx, categories, idProduct, data, products, productComplete, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, price = _a.price, description = _a.description, category = _a.category, calories = _a.calories, image = _a.image;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, , 10]);
                        slug = String(name).toLowerCase().split(" ").join("-");
                        return [4 /*yield*/, connection_1.connection.transaction()];
                    case 2:
                        trx = _b.sent();
                        return [4 /*yield*/, trx("categories")
                                .where("id", category)
                                .first()];
                    case 3:
                        categories = _b.sent();
                        idProduct = uuid_1.v4();
                        data = {
                            id: idProduct,
                            name: name,
                            price: price,
                            slug: slug,
                            quantity: 1,
                            description: description,
                            calories: calories,
                            image: process.env.API_URL_PRODUCTION + "uploads/" + req.file.filename
                        };
                        console.log(slug);
                        return [4 /*yield*/, trx("products")
                                .insert(data)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, trx("products")
                                .where('slug', slug)
                                .first()];
                    case 5:
                        products = _b.sent();
                        console.log(products.id);
                        console.log(categories.id);
                        return [4 /*yield*/, trx("products_categories")
                                .insert({
                                id: uuid_1.v4(),
                                products_id: products.id,
                                categories_id: categories.id,
                            })];
                    case 6:
                        _b.sent();
                        console.log(products);
                        console.log(idProduct);
                        return [4 /*yield*/, trx("products")
                                .join("products_categories", "products.id", "=", "products_categories.products_id")
                                .where("products.id", idProduct)
                                .first()];
                    case 7:
                        productComplete = _b.sent();
                        console.log(productComplete);
                        return [4 /*yield*/, trx.commit()];
                    case 8:
                        _b.sent();
                        res.json({ message: "Produto criado com sucesso." });
                        return [3 /*break*/, 10];
                    case 9:
                        error_1 = _b.sent();
                        res.json({ error: error_1 });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var Milkshakes, Cakes, Donuts, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, connection_1.connection("products")
                                .join("products_categories", "products.id", "=", "products_categories.products_id")
                                .where("categories_id", "be774f57-9f39-4fa2-8c58-0df7b74956e5")
                                .select([
                                "products.id",
                                "products.name",
                                "products.description",
                                "products.slug",
                                "products.quantity",
                                "products.price",
                                "products.calories",
                                "products.image",
                                "categories_id"
                            ])];
                    case 1:
                        Milkshakes = _a.sent();
                        return [4 /*yield*/, connection_1.connection("products")
                                .join("products_categories", "products.id", "=", "products_categories.products_id")
                                .where("categories_id", "095c5b42-988c-403a-8fec-b762fe8a3136")
                                .select([
                                "products.id",
                                "products.name",
                                "products.slug",
                                "products.description",
                                "products.price",
                                "products.quantity",
                                "products.calories",
                                "products.image",
                                "categories_id"
                            ])];
                    case 2:
                        Cakes = _a.sent();
                        return [4 /*yield*/, connection_1.connection("products")
                                .join("products_categories", "products.id", "=", "products_categories.products_id")
                                .where("categories_id", "6d9f7ff4-6cd4-4b1f-89ce-e72bf1d647f8")
                                .select([
                                "products.id",
                                "products.name",
                                "products.slug",
                                "products.description",
                                "products.price",
                                "products.quantity",
                                "products.calories",
                                "products.image",
                                "categories_id"
                            ])];
                    case 3:
                        Donuts = _a.sent();
                        data = {
                            milkshake: Milkshakes,
                            cake: Cakes,
                            donut: Donuts
                        };
                        res.json(data);
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        res.json({ error: error_2 });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.products = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var products, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection_1.connection("products")
                                .join("products_categories", "products.id", "=", "products_categories.products_id")
                                // .where("categories_id", "be774f57-9f39-4fa2-8c58-0df7b74956e5")
                                .select([
                                "products.id",
                                "products.name",
                                "products.description",
                                "products.slug",
                                "products.quantity",
                                "products.price",
                                "products.calories",
                                "products.image",
                                "categories_id"
                            ])];
                    case 1:
                        products = _a.sent();
                        res.json(products);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.json({ error: error_3 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.show = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, product, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.query.id;
                        console.log(id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, connection_1.connection("products")
                                .join("products_categories", "products.id", "=", "products_categories.products_id")
                                .where("products.id", String(id))
                                .first()];
                    case 2:
                        product = _a.sent();
                        res.json(product);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        res.json({ error: error_4 });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, idProduct, _a, name, description, price, calories, image, trx, user, product, productUpdate, productAfter, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.userId;
                        idProduct = req.params.idProduct;
                        _a = req.body, name = _a.name, description = _a.description, price = _a.price, calories = _a.calories, image = _a.image;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, connection_1.connection.transaction()];
                    case 2:
                        trx = _b.sent();
                        return [4 /*yield*/, trx("users").where('id', id).first()];
                    case 3:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.send({ error: "Usuário não existe no banco de dados." })];
                        }
                        if (!user.admin) {
                            return [2 /*return*/, res.send({ error: "Usuário não identificado como administrador." })];
                        }
                        return [4 /*yield*/, trx('products')
                                .where('id', String(id))
                                .first()];
                    case 4:
                        product = _b.sent();
                        return [4 /*yield*/, trx('products')
                                .where('id', String(idProduct))
                                .first()
                                .update({
                                'name': name ? name : product.name,
                                'description': description ? description : product.description,
                                'price': price ? price : product.price,
                                'slug': name ? String(name).toLowerCase().split(" ").join("-") : product.slug,
                                'calories': calories ? calories : product.calories,
                                'image': image ? image : process.env.API_URL_PRODUCTION + "uploads/" + req.file.filename
                            })];
                    case 5:
                        productUpdate = _b.sent();
                        return [4 /*yield*/, trx('products')
                                .where('id', String(id))
                                .first()];
                    case 6:
                        productAfter = _b.sent();
                        return [4 /*yield*/, trx.commit()];
                    case 7:
                        _b.sent();
                        return [2 /*return*/, res.json(productAfter)];
                    case 8:
                        error_5 = _b.sent();
                        res.json({ error: error_5 });
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.destroy = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, idProduct, trx, user, destroy, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.userId;
                        idProduct = req.params.idProduct;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, connection_1.connection.transaction()];
                    case 2:
                        trx = _a.sent();
                        return [4 /*yield*/, trx("users").where('id', id).first()];
                    case 3:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, res.send({ error: "Usuário não existe no banco de dados." })];
                        }
                        if (!user.admin) {
                            return [2 /*return*/, res.send({ error: "Usuário não identificado como administrador." })];
                        }
                        return [4 /*yield*/, trx("products")
                                .where('id', String(idProduct))
                                .first()
                                .delete()];
                    case 4:
                        destroy = _a.sent();
                        return [4 /*yield*/, trx.commit()];
                    case 5:
                        _a.sent();
                        if (!destroy) {
                            return [2 /*return*/, res.json({ error: "Erro ao deletar produto." })];
                        }
                        return [2 /*return*/, res.json({ message: "Produto deletado com sucesso." })];
                    case 6:
                        error_6 = _a.sent();
                        return [2 /*return*/, res.json({ error: error_6 })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return ProductController;
}());
exports.ProductController = ProductController;
