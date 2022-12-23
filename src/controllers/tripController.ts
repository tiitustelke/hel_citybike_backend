import { NextFunction, Request, Response } from 'express'
import { getTrips, ITripModel, getFirstTripPage } from '../models/tripModel'

const getBikeTrips = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let trips: ITripModel[] = []
  try {
    if (typeof req?.query?.start_id === undefined || req?.query?.start_id === null) {
      trips = await getTrips(<string>req.query.start_id, parseInt(<string>req.query.item_count))
      console.log('test')
    } else {
      console.log('test 2', req.query.item_count)
      trips = await getFirstTripPage(parseInt(<string>req.query.item_count))
    }
    res.json(trips)
  } catch (error) {
    console.error(error)
    res.json({ msg: 'Bike trips get error', error })
  }
}

export { getBikeTrips }