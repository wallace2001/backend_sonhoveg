import { Request, Response } from 'express';
import { connection as knex } from '../database/connection';
import { v4 as uuid } from 'uuid';

interface ProductProps{
    id: string;
    name: string;
    description: string;
    price: string;
    calories: string;
    image: string;
    categories_id: string;
}

class ProductController{
    
    async create(req: Request, res: Response){
        const {
            name,
            price,
            description,
            category,
            calories,
            image
        } = req.body;

        try {
            const slug = String(name).toLowerCase().split(" ").join("-");
            const trx = await knex.transaction();

            const categories = await trx("categories")
            .where("id", category)
            .first()

            const idProduct = uuid();

            const data = {
                id: idProduct,
                name,
                price,
                slug,
                description,
                calories,
                image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80"
            }

            console.log(slug);

            const createProduct = await trx("products")
            .insert(data)

            const products = await trx("products")
            .where('slug', slug)
            .first()

            const createManyToMany = await trx("products_categories")
            .insert({
                id: uuid(),
                products_id: products.id,
                categories_id: categories.id,
            });

            console.log(idProduct);

            const productComplete = await trx("products")
            .join("products_categories", "products.id", "=", "products_categories.products_id")
            .where("products.id", idProduct)
            .first()

            console.log(productComplete);

            await trx.commit();

            res.json(productComplete);
        } catch (error) {
            res.json({error});
        }
    }

    async index(req: Request, res: Response){
        try {
            const Milkshakes: ProductProps = await knex("products")
            .join("products_categories", "products.id", "=", "products_categories.products_id")
            .where("categories_id", "03fb9d4c-be86-417d-a24b-34b0d16a6f9b")
            .select([
                "products.id",
                "products.name",
                "products.description",
                "products.slug",
                "products.price",
                "products.calories",
                "products.image",
                "categories_id"
            ]);

            const Cakes: ProductProps = await knex("products")
            .join("products_categories", "products.id", "=", "products_categories.products_id")
            .where("categories_id", "2c47ced5-5320-4d1f-b6a2-5ddb42697a60")
            .select([
                "products.id",
                "products.name",
                "products.slug",
                "products.description",
                "products.price",
                "products.calories",
                "products.image",
                "categories_id"
            ]);

            const Donuts: ProductProps = await knex("products")
            .join("products_categories", "products.id", "=", "products_categories.products_id")
            .where("categories_id", "d0de90f7-a915-4fb0-8a39-9aa051761ed2")
            .select([
                "products.id",
                "products.name",
                "products.slug",
                "products.description",
                "products.price",
                "products.calories",
                "products.image",
                "categories_id"
            ]);

            const data = {
                milkshake: Milkshakes,
                cake: Cakes,
                donut: Donuts
            }


            res.json(data);
        } catch (error) {
            res.json({error});
        }
    }

    async show(req: Request, res: Response){
        const {
            slug,
            id
        } = req.query

        console.log(id);

        try {
            const product = await knex("products")
            .join("products_categories", "products.id", "=", "products_categories.products_id")
            .where("products.id", String(id))
            .where("products.slug", String(slug))
            .first()

            res.json(product);
        } catch (error) {
            res.json({error});
        }
    }

    async update(req: Request, res: Response){

        const { id } = req.query

        const {
            name,
            description,
            price,
            calories,
            image
        } = req.body;

        try {
            const trx = await knex.transaction();

            const product = await trx('products')
            .where('id', String(id))
            .first();

            const productUpdate = await trx('products')
            .where('id', String(id))
            .first()
            .update({
                'name': name ? name : product.name,
                'description': description ? description : product.description,
                'price': price ? price : product.price,
                'slug': name ? String(name).toLowerCase().split(" ").join("-") : product.slug,
                'calories': calories ? calories : product.calories,
                'image': image ? image : product.image
            });

            const productAfter = await trx('products')
            .where('id', String(id))
            .first();

            await trx.commit();

            return res.json(productAfter);

        } catch (error) {
            res.json({error});
        }
    }

    async destroy(req: Request, res: Response){
        const { id } = req.query;

        try {
            const destroy = await knex("products")
            .where('id', String(id))
            .first()
            .delete();

            if(!destroy){
                return res.json({error: "Erro ao deletar produto."});
            }

            return res.json({ message: "Produto deletado com sucesso." });
        } catch (error) {
            return res.json({ error });
        }
    }

}

export { ProductController }