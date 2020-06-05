import express, { response } from 'express'
import routes from './routes'
import path from 'path'

const app = express()

app.use(express.json())
app.use(routes)
app.use('/assets', express.static(path.resolve(__dirname, '..', 'assets')))

// the only parameter is the port:
app.listen(3333)