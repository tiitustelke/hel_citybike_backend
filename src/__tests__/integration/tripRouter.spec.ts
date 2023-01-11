import 'jest'
import path from 'path'
import 'supertest'
import request from 'supertest'
import { convertCsv } from '../../controllers/importController'
import { Readable } from 'stream'
import fs from 'fs'
import * as mockDB from '../utils/mockDataBase'
import { ITripModel } from '../../models/tripModel'
import { Express } from 'express'

const mockDataBasePath = path.join(__dirname, '../../../src/__tests__/testData/tripModel')

describe('Trip router tests', () => {
  let spy: any
  let app: Express

  beforeAll(async () => {
    app = (await import('../../index')).default
    spy = jest.fn()
    spy = jest.spyOn(mockDB, 'connectDB')
    await mockDB.connectDB()
  }, 30 * 1000)

  test('Check DB running', async () => {
    expect(spy).toHaveBeenCalledTimes(1)
    expect(mockDB.mongo.state).toBe('running')
  })

  let id: string | null = null

  it('Add account', async () => {

    const file = path.join(mockDataBasePath, 'normalTrip.csv')
    const tripStream: Readable = await fs.createReadStream(file)

    let response: request.Response

    await convertCsv(tripStream, async (converted: string) => {
     // console.log('converted:', converted)
      response = await request(app)
        .post('/trip/add')
        .accept('application/json')
        .send(await JSON.parse(converted))
    }).then(() => {
      expect(response.statusCode).toEqual(200)
      expect(response.header['content-type']).toMatch(/json/)
      expect(response.body.id).toBeDefined()
      expect(typeof response.body.id).toBe('string')
      id = response.body.id
    })
  }, 15 * 1000)

  it('Get account', async () => {

    let response = await request(app)
      .get(`/trip/get?id=${id}`)
      .accept('application/json')

    expect(response.statusCode).toEqual(200)
    expect(response.header['content-type']).toMatch(/json/)
    expect(response.body).toBeDefined()

    const trip: ITripModel = response.body
    expect(new Date(trip.Departure)).toEqual(new Date('2021-05-31T23:48:44'))
    expect(new Date(trip.Return)).toEqual(new Date('2021-05-31T23:56:06'))
    expect(trip['Departure station id']).toBe(235)
    expect(trip['Departure station name']).toBe('Katariina Saksilaisen katu')
    expect(trip['Return station id']).toBe(239)
    expect(trip['Return station name']).toBe('Viikin tiedepuisto')
    expect(trip['Covered distance (m)']).toBe(2107)
    expect(trip['Duration (sec)']).toBe(437)
  }, 60 * 1000)

  it('Get account with wrong id should return 404', async () => {

    let response = await request(app)
      .get(`/trip/get?id=63b5ce8368ea3bfaf0ba682d`)
      .accept('application/json')

    expect(response.statusCode).toEqual(404)
    expect(response.body.Departure).not.toBeDefined()
    expect(response.body.msg).toBe('404 not found')
  }, 60 * 1000)


  it('Add account with wrong info should return 400', async () => {
    const app = (await import('../../index')).default

    const file = path.join(mockDataBasePath, 'wrongArrivalId.csv')
    const tripStream: Readable = await fs.createReadStream(file)

    let response: request.Response

    await convertCsv(tripStream, async (converted: string) => {
      //console.log('converted:', converted)
      response = await request(app)
        .post('/trip/add')
        .accept('application/json')
        .send(await JSON.parse(converted))
    }).then(() => {
      expect(response.statusCode).toEqual(400)
      expect(response.header['content-type']).toMatch(/json/)
      expect(response.body.id).not.toBeDefined()
    })
  }, 60 * 1000)

  afterAll(async () => {
    await mockDB.disconnectDB()
  })
})