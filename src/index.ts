import express, { Express } from 'express'
import dotenv from 'dotenv'
//import cors from 'cors'

dotenv.config()

const app: Express = express()
//app.use(cors())
const port = process.env.PORT || 3001

import { router as importRoute } from './routes/importRoute'

app.use('/import', importRoute)

import { router as dataRoute } from './routes/dataRoute'

app.use('/data', dataRoute)

app.listen(port, () => {
    console.log(
        `[server]: Server is running at http://localhost:${port}/primeapi`
    )
})