import { Knex as knexProps } from 'knex'

export async function up(Knex: knexProps){
    return Knex.schema.createTable("categories", table => {
        table.uuid("id").primary(),
        table.string("name").nullable()
    });
}

export async function down(Knex: knexProps){
    return Knex.schema.dropTable("categories");
}