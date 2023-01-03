import { NextFunction, Request, Response } from 'express'
import { getTrips, ITripModel, getFirstTripPage } from '../models/tripModel'

const getBikeTrips = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let trips: ITripModel[] = []
  try {
    if (typeof req?.query?.start_id !== undefined || req?.query?.start_id !== null) {
      trips = await getTrips(<string>req.query.start_id, parseInt(<string>req.query.item_count))
    } else {
      trips = await getFirstTripPage(parseInt(<string>req.query.item_count))
    }
    res.status(200).json(trips)
  } catch (error) {
    console.error(error)
    res.status(400).json({ msg: 'Bike trips get error', error })
  }
}

export { getBikeTrips }