import { Knex as KnexProps } from 'knex';

export async function up(Knex: KnexProps){
    return Knex.schema.createTable("payments", table => {
        table.uuid("id").primary();
        table.uuid("user_id").notNullable();
        table.string("intent");
        table.string("state");
        table.string("cart");
        table.string("payer");
        table.string("status");
        table.date("date");
        table.string("transactions");
        table.date("create_time");
        table.date("update_time");
    })
}

export async function down(Knex: KnexProps){
    return Knex.schema.dropTable("payments");
}