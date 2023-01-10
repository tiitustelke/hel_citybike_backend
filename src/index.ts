import express, { Express } from 'express'
import dotenv from 'dotenv'
import * as mongoose from 'mongoose'
import { router as importRoute } from './routers/importRouter'
import { router as dataRoute } from './routers/tripRouter'
import cors from 'cors'
import bodyParser from 'body-parser'

dotenv.config()

const app: Express = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.NODE_LOCAL_PORT || 3000
const mongoPort = process.env.MONGO_LOCAL_PORT || 27017
const env = process.env.NODE_ENV || 'production'

const address = () => {
  if (env == 'development') {
    return 'localhost'
  } else {
    return 'mongo'
  }
}

if (process.env.TEST !== '1') {
  mongoose
    .connect(`mongodb://${address()}:${mongoPort}/tripdb`)
    .then(() => console.log('connected to db'))
    .catch(err => console.log(err))
}

app.use('/import', importRoute)

app.use('/trip', dataRoute)

app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port}/`,
  )
})

export default app