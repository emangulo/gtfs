import express from "express";
let router = express.Router();

import { getStationSchedule } from "../data/gtfs-static.js";

router.get("/:stationID", async (req, res) => {
  try {
    let response = await getStationSchedule(req.params.stationID);
    res.send(response);
  } catch (error) {}
});

export { router as routerStatic };
