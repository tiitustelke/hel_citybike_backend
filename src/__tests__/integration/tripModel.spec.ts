import 'jest'
import 'mongodb-memory-server'
import 'mongoose'
import { connectDB, disconnectDB } from '../utils/mockDataBase'
import { getTrip, ITripModel } from '../../models/tripModel'
import { convertCsv } from '../../controllers/importController'
import { Readable } from 'stream'
import path from 'path'
import * as fs from 'fs'

const mockDataBasePath = path.join(__dirname, '../testData')

describe('Trip model tests', () => {
  beforeAll(() => {
    connectDB()
  })

  afterAll(() => {
    disconnectDB()
  })
  //TODO: implement tests
  it('Add trip', async () => {
    const { addTrip } = await import('../../models/tripModel')
    const file = path.join(mockDataBasePath, 'normalTrip.csv')
    const tripStream: Readable = fs.createReadStream(file)
    let id: string | null = null

    const convertDone = async (json: string) => {
      const trip: ITripModel = JSON.parse(json)
      id = await addTrip(trip)
    }

    await convertCsv(tripStream, (json) => convertDone(json))

    if (id != null) {
      const trip = await getTrip(id)

      expect(trip?.Departure).toBe(Date.parse('2021-05-31T23:48:44'))
    } else {
      fail('trip is not saved correctly')
    }
  })
})