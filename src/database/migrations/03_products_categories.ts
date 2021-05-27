import { Knex as KnexProps } from 'knex';

export async function up(Knex: KnexProps){
    return Knex.schema.createTable("products_categories", table => {
        table.uuid("id").primary(),
        table.string("products_id").nullable(),
        table.string("categories_id").nullable()
    })
}

export async function down(Knex: KnexProps){
    return Knex.schema.dropTable("procuts_categories");
}