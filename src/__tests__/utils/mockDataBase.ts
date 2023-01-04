import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongo: MongoMemoryServer

const connectDB = async () => {
  try {
    let dbUrl = 'mongodb://username:password@localhost:27017'
    if (process.env.NODE_ENV === 'test') {
      mongo = await MongoMemoryServer.create()
      dbUrl = mongo.getUri()
    }

    const conn = await mongoose.connect(dbUrl)
    console.log(`Mock mongo connected: ${conn.connection.host}`)
  } catch (err) {
    console.log('mock mongo err', err)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    if (mongo) {
      await mongo.stop()
    }
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

export { connectDB, disconnectDB }