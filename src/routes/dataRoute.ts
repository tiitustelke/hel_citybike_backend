import express from "express";
import { getBikeTrips } from '../controllers/tripController'

const router = express.Router()

router.get("/trips", getBikeTrips)

export { router }
