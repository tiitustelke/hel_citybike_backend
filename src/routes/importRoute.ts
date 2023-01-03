import express from "express";
import { importBikeTrips } from '../controllers/importController'

const router = express.Router()

router.post("/all", importBikeTrips)

export { router }
