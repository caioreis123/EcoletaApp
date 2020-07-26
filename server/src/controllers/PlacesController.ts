import { Request, Response, request } from "express";
import knex from "../database/connection";

class PlacesController {
    async create(request: Request, response: Response){
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
            image: request.file.filename,
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
        const colectedItems = items
        .split(',')
        .map((item:String)=>Number(item.trim()))
        .map((item_id: number)=>{
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
    } 
}

export default PlacesController