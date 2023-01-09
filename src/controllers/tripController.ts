import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongoose'
import { getTrips, ITripModel, getFirstTripPage, addTrip } from '../models/tripModel'

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
    res.status(200).json({ lastId: trips[0]._id.toString(), trips })
  } catch (error) {
    console.error(error)
    res.status(400).json({ msg: 'Bike trips get error', error })
  }
}

const addBikeTrip = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let id: string | null = null
  try {
    id = await addTrip(await <ITripModel>JSON.parse(req.body))
    res.status(200).json({ id: id })
  } catch (error) {
    console.error(error)
    res.status(400).json({ msg: 'Bike trips get error', error })
  }
}

export { getBikeTrips, addBikeTrip }