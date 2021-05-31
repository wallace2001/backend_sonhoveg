import { Knex as KnexProps } from 'knex';

export async function up(Knex: KnexProps){
    return Knex.schema.createTable("payments", table => {
        table.increments("id").primary();
        table.uuid("id_user");
        table.string("status");
    });
}

export async function down(Knex: KnexProps){
    return Knex.schema.dropTable("payments");
}