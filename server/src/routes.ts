import express, { response, json } from 'express'
import knex from './database/connection'
import multer from 'multer'
import multerConfig from './config/multer'
import {celebrate, Joi} from 'celebrate'
import PlacesController from './controllers/PlacesController'

const routes = express.Router()
const upload = multer(multerConfig)


routes.get('/items', async (request, response) => {
    const items = await knex('items').select('*')
    const serializedItems = items.map(item => {
        return {
            "id": item.id,
            "title": item.title,
            "url": `http://192.168.15.14:3333/assets/${item.image}`
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
    const serializedPlaces = filteredPlaces.map(place => {
        return {
            ...place,
            url: `http://192.168.15.14:3333/assets/${place.image}`
        }
    })
    
    return response.json(serializedPlaces)
})

routes.get('/places/:id', async (request, response) => {
    const placeId = request.params.id
    const place = await knex('places').where('id', placeId).first()
    if(!place){
        return response.status(400).json({message: 'place not fund.'})
    }

    const serializedPlace = {
        ...place,
        url: `http://192.168.15.14:3333/assets/${place.image}`
    }

    // SELECT * FROM items
    //     JOIN place_item on items.id = place_item.item_id
    //     WHERE place_item.place_id = {id}
    const itemsColectedByThePlace = await knex('items')
        .join('place_item', 'items.id', '=', 'place_item.item_id')
        .where('place_item.place_id', placeId)
        .select('items.title')
    return response.json({place: serializedPlace, itemsColectedByThePlace})
})

const placesController = new PlacesController()

routes.post(
    '/places',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            items: Joi.string().required(),
        })
    }),
    placesController.create,
    )

export default routes