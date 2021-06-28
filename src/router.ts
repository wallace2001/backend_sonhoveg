import { Router } from 'express';
const router = Router();
import { CreateUser } from './controller/user';
import { ProductController } from './controller/product';
import { SendEmails } from './controller/emails';
import { PaymentsController } from './controller/payments';
import multer from 'multer';
import multerConfig from './multer/photos';

const upload = multer(multerConfig);

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
router.get("/change_password/:id", middlewareLogin, createUser.changePassword);
router.post("/account_recuperation", middlewareLogin, createUser.accountRecuperation);
router.post("/change_pass", middlewareLogin, createUser.changePass);
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
router.get("/auth/payment/request", middlewareLogin, paymentsController.payments);
router.get("/auth/payment/userpayments", middlewareLogin, paymentsController.userPayment);
router.patch("/auth/payment/update_status/:idPayment", middlewareLogin, paymentsController.updateStatus);

// Product
router.post("/auth/createProduct", middlewareLogin, upload.single('file'), productController.create);
router.get("/product", productController.show);
router.get("/products", productController.index);
router.get("/productsall", productController.products);
router.patch("/auth/products_update/:idProduct", middlewareLogin, upload.single('file'), productController.update);
router.delete("/auth/products_delete/:idProduct", middlewareLogin, productController.destroy);

export { router }