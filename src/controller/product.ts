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

interface PropsRequest extends Request{
    userId: string;
}


class ProductController{
    
    async create(req: PropsRequest, res: Response){
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
            .first();

            const idProduct = uuid();

            const data = {
                id: idProduct,
                name,
                price,
                slug,
                quantity: 1,
                description,
                calories,
                image: `${process.env.API_URL_PRODUCTION}/uploads/${req.file.filename}`
            }

            console.log(slug);

            await trx("products")
            .insert(data);

            const products = await trx("products")
            .where('slug', slug)
            .first();

            console.log(products.id);
            console.log(categories.id);

            await trx("products_categories")
            .insert({
                id: uuid(),
                products_id: products.id,
                categories_id: categories.id,
            });

            console.log(products);

            console.log(idProduct);

            const productComplete = await trx("products")
            .join("products_categories", "products.id", "=", "products_categories.products_id")
            .where("products.id", idProduct)
            .first()

            console.log(productComplete);

            await trx.commit();

            res.json({message: "Produto criado com sucesso."});
        } catch (error) {
            res.json({error});
        }
    }

    async index(req: PropsRequest, res: Response){

        try {

            const Milkshakes: ProductProps = await knex("products")
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
            ]);

            const Cakes: ProductProps = await knex("products")
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
            ]);

            const Donuts: ProductProps = await knex("products")
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
    
    async products(req: PropsRequest, res: Response){

        try {

            const products: ProductProps = await knex("products")
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
            ]);

            res.json(products);
        } catch (error) {
            res.json({error});
        }
    }

    async show(req: PropsRequest, res: Response){
        const {
            id
        } = req.query

        console.log(id);

        try {
            const product = await knex("products")
            .join("products_categories", "products.id", "=", "products_categories.products_id")
            .where("products.id", String(id))
            .first()

            res.json(product);
        } catch (error) {
            res.json({error});
        }
    }

    async update(req: PropsRequest, res: Response){

        const id = req.userId;

        const {
            name,
            description,
            price,
            calories,
            image
        } = req.body;

        try {
            const trx = await knex.transaction();

            const user = await trx("users").where('id', id).first();

            if(!user){
                return res.send({ error: "Usuário não existe no banco de dados." });
            }

            if(!user.admin){
                return res.send({ error: "Usuário não identificado como administrador." });
            }

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

    async destroy(req: PropsRequest, res: Response){
        const id = req.userId;

        try {

            const trx = await knex.transaction();

            const user = await trx("users").where('id', id).first();

            if(!user){
                return res.send({ error: "Usuário não existe no banco de dados." });
            }

            if(!user.admin){
                return res.send({ error: "Usuário não identificado como administrador." });
            }

            const destroy = await trx("products")
            .where('id', String(id))
            .first()
            .delete();

            await trx.commit();

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