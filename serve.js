import express, { response } from "express";
import { getStationData } from "./modules/gtfs-live.js";
import { getStationSchedule } from "./modules/gtfs-static.js";

let PORT = process.env.PORT || 3000;

let app = express();

app.get("/live/:stationID", async (req, res) => {
  try {
    let stationData = await getStationData(req.params.stationID);
    console.log(stationData);
    res.send(stationData);

    let now = new Date(Date.now());
    console.log(`Updated: ${now.toString()}`);
  } catch (error) {
    console.error(error);
  }
});

app.get("/static/:stationID", async (req, res) => {
  try {
    let response = await getStationSchedule(req.params.stationID);
    res.send(response);
  } catch (error) {}
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
