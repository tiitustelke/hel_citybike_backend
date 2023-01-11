import { NextFunction, Request, Response } from 'express'
import { MongooseError, ObjectId } from 'mongoose'
import { getTrips, ITripModel, getFirstTripPage, addTrip, getTrip } from '../models/tripModel'

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
    id = await addTrip(await req.body)
    if (id === null) {
      res.status(400).json({ msg: 'Bad details' })
    } else {
      res.status(200).json({ id: id })
    }
  } catch (error) {
    res.status(400).json({ msg: 'Bike trip add error', error })
  }
}

const getBikeTrip = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let trip: ITripModel | null = null
  try {
    trip = await getTrip(<string>req.query.id)
    if (trip === null) {
      res.status(404).json({msg: '404 not found'})
    } else {
      res.status(200).json(trip)
    }
  } catch (error) {
    if ((error as MongooseError).message === 'Operation `trips.findOne()` buffering timed out after 10000ms') {
      res.status(404).json({msg: '404 not found'})
    }
    res.status(400).json({ msg: 'Bike trip get error', error })
  }
}

export { getBikeTrips, addBikeTrip, getBikeTrip }