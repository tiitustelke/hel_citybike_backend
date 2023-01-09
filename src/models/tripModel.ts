import mongoose, { CallbackWithoutResultAndOptionalError, Error, ObjectId, Schema } from 'mongoose'

interface ITripModel {
  '_id': ObjectId
  'Departure': Date,
  'Return': Date,
  'Departure station id': number,
  'Departure station name': string,
  'Return station id': number,
  'Return station name': string,
  'Covered distance (m)': number,
  'Duration (sec)': number
}

const TripSchema = new Schema<ITripModel>(
  {
    'Departure': {
      type: Date,
      required: true,
    },
    'Return': {
      type: Date,
      required: true,
    },
    'Departure station id': {
      type: Number,
      min: [1, 'Station id should be positive number'],
      required: true,
    },
    'Departure station name': {
      type: String,
      required: true,
    },
    'Return station id': {
      type: Number,
      min: [1, 'Station id should be positive number'],
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
    'Duration (sec)': {
      type: Number,
      min: [10, 'Too short duration'],
      required: true,
    },
  },
)

TripSchema.pre('validate', (next: CallbackWithoutResultAndOptionalError) => {
  if (typeof this === undefined) {
    next(new Error('Fields not initialized properly'))
  } else { // @ts-ignore
    if (this.startDate > this.endDate) {
      next(new Error('End date must be greater than start date'))
    } else {
      next()
    }
  }
})

const tripModel = mongoose.model<ITripModel>('Trip', TripSchema)

const addTrip = async (trip: ITripModel): Promise<string | null> => {
  let id: string | null = null

  const newTrip = new tripModel(trip)
  await new Promise((resolve, reject) => {
    newTrip.save((err, trip) => {
      if (err) {
        reject(new Error(`Trip save error ${err}`))
      } else {
        resolve(trip.id)
      }
    })
  }).then(res => {
    if (res !== null) {
      id = res as string
    }
  }).catch(err => {
    console.log(err)
  })

  return id
}

const getTrip = async (tripId: string): Promise<ITripModel | null> => {
  const id = new mongoose.Types.ObjectId(tripId)

  let trip: ITripModel | null = null

  const query = tripModel
    .findOne({ _id: id }).exec()
  await query
    .then((data: ITripModel | null) => {
      trip = data
    })
    .catch((err: Error) => {
      console.log('getTrip error', err)
      throw err
    })

  return trip
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

export { ITripModel, addTrip, getTrip, getTrips, getFirstTripPage, TripSchema, tripModel }