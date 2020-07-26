import express, { response } from 'express'
import routes from './routes'
import path from 'path'
import cors from 'cors'
import {errors} from 'celebrate'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/assets', express.static(path.resolve(__dirname, '..', 'assets')))
app.use(errors())

// the only parameter is the port:
app.listen(3333)