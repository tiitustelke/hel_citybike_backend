import express from "express";
import { addBikeTrip, getBikeTrips } from '../controllers/tripController'

const router = express.Router()

router.get("/trips", getBikeTrips)

router.post('/add', addBikeTrip)

export { router }
