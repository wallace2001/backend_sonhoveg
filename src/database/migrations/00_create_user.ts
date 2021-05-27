import { Knex as KnexProps } from 'knex';

export async function up(Knex: KnexProps){
    return Knex.schema.createTable("users", table => {
        table.increments("id").primary();
        table.string("name").nullable();
        table.string("email").nullable().unique();
        table.string("telphone").nullable();
        table.date("year").nullable();
        table.string("sex").nullable();
        table.string("password").nullable();
        table.boolean("confirmAccount").nullable();
        table.boolean("admin").nullable();
    });
}

export async function down(Knex: KnexProps){
    return Knex.schema.dropTable("users");
}