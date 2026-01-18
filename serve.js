import express from "express";
import cors from "cors";
import { getStationData } from "./modules/gtfs.js";

let PORT = process.env.PORT || 3000;

let app = express();

app.use(cors());

app.get("/:stationID", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
