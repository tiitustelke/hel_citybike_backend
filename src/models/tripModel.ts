import mongoose, { Schema } from 'mongoose'
import csv from 'csvtojson'
import axios, { AxiosResponse } from 'axios'

interface ITripModel {
  'Departure': string,
  'Return': string,
  'Departure station id': number,
  'Departure station name': string,
  'Return station id': number,
  'Return station name': string,
  'Covered distance (m)': number,
  'Duration (sec.)': number
}

const TripSchema = new Schema<ITripModel>(
  {
    'Departure': {
      type: String,
      required: true,
    },
    'Return': {
      type: String,
      required: true,
    },
    'Departure station id': {
      type: Number,
      required: true,
    },
    'Departure station name': {
      type: String,
      required: true,
    },
    'Return station id': {
      type: Number,
      required: true,
    },
    'Return station name': {
      type: String,
      required: true,
    },
    'Covered distance (m)': {
      type: Number,
      min: [10, 'Too short distance'],
      required: true,
    },
    'Duration (sec.)': {
      type: Number,
      min: [10, 'Too short duration'],
      required: true,
    },
  },
)

const tripModel = mongoose.model<ITripModel>('Trip', TripSchema)

//imports data to db from csv line converted to json
const importData = async (json: String) => {
  try {
    const newTrip = new tripModel(json)
    await newTrip.save((err) => {
      if (err) return console.log('trip save error', err)
    })
    console.log('csv line imported')
    //process.exit()
  } catch (error) {
    console.log('error', error)
  }
}

const importTrips = async (): Promise<Boolean> => {
  const urls: Array<String> = JSON.parse(<string>process.env['DATA_URLS'])
  const calls: Array<Promise<AxiosResponse>> = []

  for (const url of urls) {
    calls.push(
      axios.get(String(url), {
          responseType: 'stream',
        },
      ))
  }

  for (const call of calls) {
    const response = await call

    const stream = response.data

    const onError = () => {
      return false
    }
    const onComplete = () => {
      return true
    }

    await csv({
      delimiter: [','],
      flatKeys: true,
      checkType: true,
    })
      .fromStream(stream)
      .subscribe((json) => {
        return new Promise(async (resolve, reject) => {
          await importData(json)
          resolve()
        })
      }, onError, onComplete)
  }

  return false
}

const getTrips = async (startValue: string, itemsPerPage: number): Promise<ITripModel[]> => {
  const id = new mongoose.Types.ObjectId(startValue)
  const query = tripModel
    .find({ _id: { $lt: id } })
    .sort({ 'Departure': -1, _id: -1 })
    .limit(itemsPerPage)
  return await query.exec()
}

const getFirstTripPage = async (itemsPerPage: number): Promise<ITripModel[]> => {
  console.log(itemsPerPage)
  const query = tripModel
    .find({})
    .sort({ 'Departure': -1 })
    .limit(itemsPerPage)
  return await query.exec()
}

export { ITripModel, importTrips, getTrips, getFirstTripPage }