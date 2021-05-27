import { Knex as KnexProps } from 'knex';
import { v4 as uuid } from 'uuid';

export async function seed(Knex: KnexProps) {
    await Knex("categories").insert([
        {id: uuid(),name: "Donuts"},
        {id: uuid(), name: "Bolos"},
        {id: uuid(), name: "Milkshakes"},
    ]);
}