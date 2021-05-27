import { Router } from 'express';
const router = Router();
import { CreateUser } from './controller/user';
import { ProductController } from './controller/product';
const middlewareLogin =  require('./middleware/logged');

const createUser = new CreateUser();
const productController = new ProductController();

// User
router.post("/createUser", createUser.create);
router.post("/loginUser", createUser.index);
router.get("/auth/user", middlewareLogin, createUser.user);
router.get("/confirmaccout/id:id&token:token", createUser.showConfirm);
router.get("/change", middlewareLogin, createUser.change);
router.get("/change_password/:id", createUser.changePassword);
router.post("/account_recuperation", createUser.accountRecuperation);
router.post("/change_pass", createUser.changePass);

// Product
router.post("/createProduct", productController.create);
router.get("/product", productController.show);
router.get("/products", productController.index);
router.patch("/products_update", productController.update);
router.delete("/products_delete", productController.destroy);

export { router }