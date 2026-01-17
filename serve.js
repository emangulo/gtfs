import express from "express";
import { getStationData } from "./modules/gtfs.js";

let PORT = process.env.PORT || 3000;

let app = express();

app.get("/", async (req, res) => {
  try {
    let stationData = await getStationData();
    res.send(stationData);

    let now = new Date(Date.now());

    console.log(`Updated: ${now.toString()}`);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
