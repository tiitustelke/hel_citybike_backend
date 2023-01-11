import express from "express";
import { addBikeTrip, getBikeTrips, getBikeTrip } from '../controllers/tripController'

const router = express.Router()

router.get("/trips", getBikeTrips)

router.post('/add', addBikeTrip)

router.get('/get', getBikeTrip)

export { router }
