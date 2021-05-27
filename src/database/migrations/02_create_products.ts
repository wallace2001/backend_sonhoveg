import { Knex as KnexProps } from 'knex';

export async function up(Knex: KnexProps){
    return Knex.schema.createTable("products", table => {
        table.uuid("id").primary(),
        table.string("name").nullable(),
        table.string("slug").nullable().unique(),
        table.string("description").nullable(),
        table.string("price").nullable(),
        table.string("calories").nullable(),
        table.string("image").nullable()
    })
}

export async function down(Knex: KnexProps){
    return Knex.schema.dropTable("products");
}