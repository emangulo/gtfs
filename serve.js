import express from "express";
import { getStationData } from "./modules/gtfs.js";

let PORT = process.env.PORT || 3000;

let app = express();

app.get("/", async (req, res) => {
  try {
    let stationData = await getStationData();
    let now = Date.now();
    res.send(stationData);
    console.log("Sent");
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
