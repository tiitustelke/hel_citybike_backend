import 'mongodb-memory-server'
import * as mockDB from '../utils/mockDataBase'
import { addTrip, getTrip, ITripModel } from '../../models/tripModel'
import { convertCsv } from '../../controllers/importController'
import { Readable } from 'stream'
import path from 'path'
import * as fs from 'fs'
import 'jest'

const mockDataBasePath = path.join(__dirname, '../../../src/__tests__/testData')

describe('Trip model tests', () => {
  let spy: any

  beforeAll(async () => {
    spy = jest.fn()
    spy = jest.spyOn(mockDB, 'connectDB')
    await mockDB.connectDB()
  }, 30 * 1000)

  test('Check DB running', async () => {
    expect(spy).toHaveBeenCalledTimes(1)
    expect(mockDB.mongo.state).toBe('running')
  })

  //TODO: implement tests
  it('Add trip', async () => {
    const file = path.join(mockDataBasePath, 'normalTrip.csv')
    const tripStream: Readable = await fs.createReadStream(file)

    let id: string | null = null

    await convertCsv(tripStream, async (json) => {
      id = await addTrip(await JSON.parse(json))
    })

    expect(id).not.toBeNull()

    let trip: ITripModel | null = await getTrip(id as unknown as string)
    expect(trip).not.toBeNull()

    trip = trip as unknown as ITripModel
    expect(trip.Departure).toEqual(new Date('2021-05-31T23:48:44'))
    expect(trip.Return).toEqual(new Date('2021-05-31T23:56:06'))
    expect(trip['Departure station id']).toBe(235)
    expect(trip['Departure station name']).toBe('Katariina Saksilaisen katu')
    expect(trip['Return station id']).toBe(239)
    expect(trip['Return station name']).toBe('Viikin tiedepuisto')
    expect(trip['Covered distance (m)']).toBe(2107)
    expect(trip['Duration (sec)']).toBe(437)

  }, 15 * 1000)

  it('Add trip with non valid departure time', async () => {
    const file = path.join(mockDataBasePath, 'wrongDepartureTrip.csv')

    await getTestTrip(file)
  }, 15 * 1000)

  it('Add trip with non valid arrival time', async () => {
    const file = path.join(mockDataBasePath, 'wrongArrivalTrip.csv')

    await getTestTrip(file)
  }, 15 * 1000)

  afterAll(async () => {
    await mockDB.disconnectDB()
  }, 10 * 1000)
})

const getTestTrip = async (file: string) => {
  const tripStream: Readable = await fs.createReadStream(file)

  let id: string | null = null

  await convertCsv(tripStream, async (json) => {
    id = await addTrip(await JSON.parse(json))
  })
  expect(id).toBeNull()

  const trip = await getTrip(<string><unknown>id)
  expect(trip).toBeNull()
}