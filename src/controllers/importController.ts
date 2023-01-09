import { NextFunction, Request, Response } from 'express'
import { addTrip, ITripModel } from '../models/tripModel'
import axios, { AxiosResponse } from 'axios'
import csv from 'csvtojson'
import { Readable } from 'stream'

const importBikeTrips = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await importTrips()
    res.status(200).json({ msg: 'Bike trips imported' })
  } catch (error) {
    res.status(400).json({ msg: 'Bike trips import error', error })
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

  const onError = () => {
    return false
  }

  for (const call of calls) {
    const response = await call

    const stream: Readable = response.data

    await convertCsv(stream, async (json) => {
      await addTrip(<ITripModel>await JSON.parse(json))
    }, onError)
  }

  return true
}

const convertCsv = async (stream: Readable, converted: (json: string) => Promise<void>, onError?: () => void): Promise<void> => {
  await csv({
    delimiter: [','],
    flatKeys: true,
    checkType: true,
  })
    .fromStream(stream)
    .subscribe((json) => {
      return new Promise(async (resolve, reject) => {
        let str: string = JSON.stringify(json)
        str = str.split('.').join('')
        await converted(str)
        resolve()
      })
    }, onError, () => {
      return
    })
}

export { importBikeTrips, convertCsv }