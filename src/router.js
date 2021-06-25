"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var router = express_1.Router();
exports.router = router;
var user_1 = require("./controller/user");
var product_1 = require("./controller/product");
var emails_1 = require("./controller/emails");
var payments_1 = require("./controller/payments");
var multer_1 = __importDefault(require("multer"));
var photos_1 = __importDefault(require("./multer/photos"));
var upload = multer_1.default(photos_1.default);
var middlewareLogin = require('./middleware/logged');
var createUser = new user_1.CreateUser();
var productController = new product_1.ProductController();
var sendEmails = new emails_1.SendEmails();
var paymentsController = new payments_1.PaymentsController();
// User
router.post("/createUser", createUser.create);
router.post("/loginUser", createUser.index);
router.get("/auth/user", middlewareLogin, createUser.user);
router.get("/confirmaccout/id:id&token:token", createUser.showConfirm);
router.get("/change", middlewareLogin, createUser.change);
router.get("/change_password/:id", createUser.changePassword);
router.post("/account_recuperation", createUser.accountRecuperation);
router.post("/change_pass", createUser.changePass);
router.get("/auth/userList", middlewareLogin, createUser.listUser);
// Send E-mails
router.post("/auth/send_email", middlewareLogin, sendEmails.create);
router.post("/auth/sendEmail", middlewareLogin, sendEmails.sendEmail);
// Payments
router.get("/auth/payment", paymentsController.index);
router.get("/auth/payment/buy", paymentsController.buy);
router.post("/auth/payment/save_cart", middlewareLogin, paymentsController.saveCart);
router.get("/auth/payment/delete_cart", middlewareLogin, paymentsController.deleteCart);
router.get("/auth/payment/success", paymentsController.success);
router.get("/auth/payment/cancel", paymentsController.cancel);
router.get("/auth/payment/request", paymentsController.payments);
router.get("/auth/payment/userpayments", middlewareLogin, paymentsController.userPayment);
// Product
router.post("/auth/createProduct", middlewareLogin, upload.single('file'), productController.create);
router.get("/product", productController.show);
router.get("/products", productController.index);
router.get("/productsall", productController.products);
router.patch("/products_update", productController.update);
router.delete("/products_delete", productController.destroy);
