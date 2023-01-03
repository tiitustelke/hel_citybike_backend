import { NextFunction, Request, Response } from 'express'
import { importTrips } from '../models/tripModel'

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

export { importBikeTrips }