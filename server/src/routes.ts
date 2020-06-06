import express, { response, json } from 'express'
import knex from './database/connection'

const routes = express.Router()

routes.get('/items', async (request, response) => {
    const items = await knex('items').select('*')
    const serializedItems = items.map(item => {
        return {
            "id": item.id,
            "title": item.title,
            "url": `http://localhost:3333/assets/${item.image}`
        }
    })
    return response.json(serializedItems)
})

routes.get('/places', async (request, response) => {
    const {city, state, items} = request.query
    const formatedItemsIds = String(items).split(',').map(item=>Number(item.trim()))
    const filteredPlaces = await knex('places')
        .join('place_item', 'places.id', '=', 'place_item.place_id')
        .whereIn('place_item.item_id', formatedItemsIds)
        .where('city', String(city))
        .where('state', String(state))
        .distinct()
        .select('places.*')    
    return response.json(filteredPlaces)
})

routes.get('/places/:id', async (request, response) => {
    const placeId = request.params.id
    const place = await knex('places').where('id', placeId).first()
    if(!place){
        return response.status(400).json({message: 'place not fund.'})
    }
    // SELECT * FROM items
    //     JOIN place_item on items.id = place_item.item_id
    //     WHERE place_item.place_id = {id}
    const itemsColectedByThePlace = await knex('items')
        .join('place_item', 'items.id', '=', 'place_item.item_id')
        .where('place_item.place_id', placeId)
        .select('items.title')
    return response.json({place, itemsColectedByThePlace})
})

routes.post('/places', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        state,
        items
    } = request.body
    const trx = await knex.transaction()
    const place = {
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        state,
    }
    const insertedPlacesIds = await trx('places').insert(place)
    const insertedPlaceId = insertedPlacesIds[0]
    const colectedItems = items.map(item_id=>{
        return {
            item_id,
            place_id:insertedPlaceId
        }
    })
    await trx('place_item').insert(colectedItems)
    await trx.commit()
    return response.json({
        id: insertedPlaceId,
        ...place
    })
})

export default routes