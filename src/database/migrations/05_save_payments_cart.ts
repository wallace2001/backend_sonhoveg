import { Knex as KnexProps } from 'knex';

export async function up(Knex: KnexProps){
    return Knex.schema.createTable("cart_payments", table => {
        table.uuid("id").primary();
        table.string("user_id").notNullable();
        table.string("name").notNullable();
        table.string("sku").notNullable();
        table.float("price").notNullable();
        table.string("currency").notNullable();
        table.float("quantity").notNullable();
    });
}

export async function down(Knex: KnexProps){
    return Knex.schema.dropTable("cart_payments");
}