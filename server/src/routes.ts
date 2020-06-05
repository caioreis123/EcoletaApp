import express, { response } from 'express'

const routes = express.Router()

const user = [
    "Miguel",
    "Caio"
]

routes.get('/users', (request, response) => {
    response.json(user)
})

export default routes