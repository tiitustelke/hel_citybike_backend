import express, { Express } from 'express'
import dotenv from 'dotenv'
import * as mongoose from 'mongoose'
import { router as importRoute } from './routes/importRoute'
import { router as dataRoute } from './routes/dataRoute'
import cors from 'cors'

dotenv.config()

const app: Express = express()
app.use(cors())
const port = process.env.PORT || 3000

mongoose.connect('mongodb://localhost:27017/tripdb').then(() => console.log('connected to db')).catch(err => console.log(err))

app.use('/import', importRoute)

app.use('/data', dataRoute)

app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port}/`,
  )
})