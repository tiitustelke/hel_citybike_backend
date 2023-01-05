import 'mongodb-memory-server'
import 'mongoose'
import * as mockDB from '../utils/mockDataBase'
import { ITripModel, TripSchema } from '../../models/tripModel'
import { convertCsv } from '../../controllers/importController'
import { Readable } from 'stream'
import path from 'path'
import * as fs from 'fs'
import 'jest'
import mongoose from 'mongoose'

const mockDataBasePath = path.join(__dirname, '../../../src/__tests__/testData')

describe('Trip model tests', () => {
  let spy: any
  const tripModel = mongoose.model<ITripModel>('Trip', TripSchema)
  beforeAll(() => {
    spy = jest.fn()
    spy = jest.spyOn(mockDB, 'connectDB')
    jest.spyOn(mockDB, 'disconnectDB')
  }, 30 * 1000)

  afterAll(() => {
    new Promise(() => mockDB.disconnectDB())
  })

  test('Check DB running', async () => {
    await mockDB.connectDB()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(mockDB.mongo.state).toBe('running')
  })

  //TODO: implement tests
  it('Add trip', async () => {
    const file = path.join(mockDataBasePath, 'normalTrip.csv')
    const tripStream: Readable = await fs.createReadStream(file)

    let id: string | null = null
    const convertDone = async (json: string): Promise<void> => {
      const trip: ITripModel = await <ITripModel>JSON.parse(JSON.stringify(json))
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
        throw err
      })
    }

    await convertCsv(tripStream, async (json) => {
      await convertDone(json)
    })

    console.log('_id: ', id)
    expect(id).not.toBeNull()

    if (id !== null) {
      const mongoId = new mongoose.Types.ObjectId(id)
      let trip: ITripModel | null

      const query = tripModel
        .findOne({ _id: mongoId }).exec()
      query
        .then((data) => {
          trip = data
          expect(trip?.Departure).toBe(Date.parse('2021-05-31T23:48:44'))
        })
        .catch((err) => {
          console.log('getTrip error', err)
        })

    }
  }, 15 * 1000)
})