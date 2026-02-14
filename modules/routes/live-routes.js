import express from "express";
let router = express.Router();

import { getStationData } from "../gtfs-live.js";

router.get("/:stationID", async (req, res) => {
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

export { router as routerLive };
