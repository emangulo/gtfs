import express from "express";
import { getStationData } from "./modules/gtfs-live.js";
import { getStationSchedule } from "./modules/gtfs-static.js";

let PORT = process.env.PORT || 3000;
let app = express();

const API_KEY = process.env.API_KEY;

let checkAPIKey = (req, res, next) => {
  const apiKey = req.query.api_key;

  if (apiKey === API_KEY) {
    next();
  } else {
    res.status(403).send("Invalid API Key");
  }
};
app.use(checkAPIKey);

// Routes Here
app.get("/live/:stationID", async (req, res) => {
  try {
    let stationData = await getStationData(req.params.stationID);
    res.send(stationData);
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
