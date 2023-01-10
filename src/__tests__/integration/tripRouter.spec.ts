import 'jest'
import path from 'path'
import 'supertest'
import request from 'supertest'
import { convertCsv } from '../../controllers/importController'
import { Readable } from 'stream'
import fs from 'fs'
import * as mockDB from '../utils/mockDataBase'
import { ITripModel } from '../../models/tripModel'

const mockDataBasePath = path.join(__dirname, '../../../src/__tests__/testData/tripModel')

describe('Trip router tests', () => {
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

  it('Add account', async () => {
    const app = (await import('../../index')).default

    const file = path.join(mockDataBasePath, 'normalTrip.csv')
    const tripStream: Readable = await fs.createReadStream(file)

    let response: request.Response

    await convertCsv(tripStream, async (converted: string) => {
      console.log('converted:', converted)
      response = await request(app)
        .post('/trip/add')
        .accept('application/json')
        .send(await JSON.parse(converted))
    }).then(() => {
      expect(response.statusCode).toEqual(200)
      expect(response.header['content-type']).toMatch(/json/)
      expect(response.body.id).toBeDefined()
    })
  })
})