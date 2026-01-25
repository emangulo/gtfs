import express from "express";
let routerStatic = express.Router();

import { getStationSchedule } from "../gtfs-static.js";

routerStatic.get("/:stationID", async (req, res) => {
  try {
    let response = await getStationSchedule(req.params.stationID);
    res.send(response);
  } catch (error) {}
});

export { routerStatic };
