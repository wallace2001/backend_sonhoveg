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

        // const id = req.userId;

        try {
            
            const slug = String(name).toLowerCase().split(" ").join("-");
            const trx = await knex.transaction();

            // const user = await trx('users').where('id', id).first();
            
            // if(!user){
            //     return res.send({ error: "Erro ao criar produto." });
            // }

            // if(!user.admin){
            //     return res.send({ error: "Usuário não identificado como administrador." });
            // }

            const categories = await trx("categories")
            .where("id", category)
            .first();

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

            res.json(productComplete);
        } catch (error) {
            res.json({error});
        }
    }

    async index(req: PropsRequest, res: Response){

        try {

            const Milkshakes: ProductProps = await knex("products")
            .join("products_categories", "products.id", "=", "products_categories.products_id")
            .where("categories_id", "d5ae18d0-4332-45e0-92ae-3edb98360d1f")
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
            .where("categories_id", "efa6615e-e6e8-4f7c-9cb7-9e72fd3f8ccb")
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
            .where("categories_id", "b8d73352-fc4f-42d8-9f19-85eb7c584488")
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