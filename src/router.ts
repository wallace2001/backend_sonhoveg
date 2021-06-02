import { Router } from 'express';
const router = Router();
import { CreateUser } from './controller/user';
import { ProductController } from './controller/product';
import { SendEmails } from './controller/emails';
import { PaymentsController } from './controller/payments';
const middlewareLogin =  require('./middleware/logged');

const createUser = new CreateUser();
const productController = new ProductController();
const sendEmails = new SendEmails();
const paymentsController = new PaymentsController();

// User
router.post("/createUser", createUser.create);
router.post("/loginUser", createUser.index);
router.get("/auth/user", middlewareLogin, createUser.user);
router.get("/confirmaccout/id:id&token:token", createUser.showConfirm);
router.get("/change", middlewareLogin, createUser.change);
router.get("/change_password/:id", createUser.changePassword);
router.post("/account_recuperation", createUser.accountRecuperation);
router.post("/change_pass", createUser.changePass);

// Send E-mails
router.post("/auth/send_email", middlewareLogin, sendEmails.create);

// Payments
router.get("/auth/payment", paymentsController.index);
router.get("/auth/payment/buy", paymentsController.buy);
router.get("/auth/payment/success", paymentsController.success);
router.get("/auth/payment/cancel", paymentsController.cancel);

// Product
router.post("/createProduct", productController.create);
router.get("/product", productController.show);
router.get("/products", productController.index);
router.patch("/products_update", productController.update);
router.delete("/products_delete", productController.destroy);

export { router }