import mongoose from 'mongoose'
import csv from 'csvtojson'
import path from 'path'
import axios from 'axios'

const TripSchema = new mongoose.Schema(
  {
    'Departure': String,
    'Return': String,
    'Departure station id': {
      type: Number,
      unique: true,
    },
    'Departure station name': String,
    'Return station id': {
      type: Number,
      unique: true,
    },
    'Return station name': String,
    'Covered distance (m)': Number,
    'Duration (sec)': Number,
  },
)

const tripModel = mongoose.model('Trip', TripSchema)

//imports data to db from csv line converted to json
const importData = async (json: String) => {
  try {
    await tripModel.create(json)
    console.log('csv line imported')
    //process.exit()
  } catch (error) {
    console.log('error', error)
  }
}

const importTrips = async (): Promise<Boolean> => {
  const response = await axios.get('https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv', {
    responseType: 'stream',
  })

  const stream = response.data

  const onError = () => {
    return false
  }
  const onComplete = () => {
    return true
  }

  csv()
    .fromStream(stream)
    .subscribe((json) => {
      return new Promise((resolve, reject) => {
        console.log(json)
        importData(json)
      })
    }, onError, onComplete)

  return false
}

export { tripModel, importTrips }