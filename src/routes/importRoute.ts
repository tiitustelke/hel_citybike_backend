import express from "express";
import { importTrips } from '../models/tripModel'

const router = express.Router()

router.get("/all", importTrips)

export { router }