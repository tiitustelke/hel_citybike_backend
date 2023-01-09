import 'jest'
import path from 'path'
import 'supertest'
import request from 'supertest'
import { convertCsv } from '../../controllers/importController'
import { Readable } from 'stream'
import fs from 'fs'

const mockDataBasePath = path.join(__dirname, '../../../src/__tests__/testData/tripModel')

describe('Trip router tests', () => {

  it('Add account', async () => {
    const app = (await import('../../index')).default

    const file = path.join(mockDataBasePath, 'normalTrip.csv')
    const tripStream: Readable = await fs.createReadStream(file)

    const response = request(app)
      .post('/trip/add')
      .accept('application/json')

    await convertCsv(tripStream, async (converted: string) => {
      await response.send(await JSON.parse(converted))
    })

    response.expect(200, )


  })
})