import express from "express";
let routerLive = express.Router();

import { getStationData } from "../gtfs-live.js";

routerLive.get("/:stationID", async (req, res) => {
  try {
    let stationData = await getStationData(req.params.stationID);
    if (stationData == []) {
      res.send("No scheduled trains");
    } else {
      res.send(stationData);
    }
  } catch (error) {
    console.error(error);
  }
});

export { routerLive };
