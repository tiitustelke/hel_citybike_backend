import { NextFunction, Request, Response } from "express";
import { tripModel, importTrips } from "../models/tripModel";

const importBikeTrips = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await importTrips();
    res.json({ msg: "Bike trips imported" });
  } catch (error) {
    res.json({ msg: "Bike trips error", error });
  }
};