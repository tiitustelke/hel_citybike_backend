import express from "express";
import { importBikeTrips } from '../controllers/importController'

const router = express.Router()

router.get("/all", importBikeTrips)

export { router }
