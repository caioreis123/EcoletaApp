import Knex from 'knex'

export async function up(knex:Knex){
    return knex.schema.createTable('place_item', table=>{
        table.increments('id').primary()
        table.integer('place_id').notNullable().references('id').inTable('places')
        table.integer('item_id').notNullable().references('id').inTable('items')
    })
}

export async function down (knex: Knex){
    return knex.schema.dropTable('place_item')
}