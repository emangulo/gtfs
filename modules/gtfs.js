import "dotenv/config";
import { updateLocalCache, localCache } from "./cache.js";
import { lineInfo } from "./line-info.js";

import GtfsRealtimeBindings from "gtfs-realtime-bindings";

let url = "https://metrolink-gtfsrt.gbsdigital.us/feed/gtfsrt-trips";
let headers = {
  headers: {
    "x-api-key": process.env.metrolinkKey,
  },
};

let getGTFS = async () => {
  try {
    const response = await fetch(url, headers);
    if (!response.ok) {
      const error = new Error(
        `${response.url}: ${response.status} ${response.statusText}`,
      );
      error.response = response;
      throw error;
    }
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer),
    );

    let results = [];

    feed.entity.forEach((entity) => {
      if (entity.tripUpdate) {
        results.push(entity.tripUpdate);
      }
    });

    return results;
  } catch (error) {
    console.log("getGTFS failed: ", error);
    throw error;
  }
};

let getStationData = async (stopID) => {
  try {
    let feed = await getGTFS();
    let response = [];
    // let filtered = feed.filter((entity) => entity.trip.routeId === routeID);

    feed.forEach((trip) => {
      let route = trip.trip.routeId;
      let direction = trip.trip.directionId;
      let allStops = trip.stopTimeUpdate;

      allStops.forEach((stop) => {
        let unix = stop.arrival.time;
        if (stop.stopId == stopID && stop.arrival.time >= Date.now() / 1000) {
          response.push({
            route: lineInfo[route].short_name,
            to: lineInfo[route].to[direction],
            unix: unix,
            time: new Date(unix * 1000).toLocaleTimeString(),
          });
        }
      });
    });
    response.sort((a, b) => a.unix - b.unix);

    return formatter(response);
  } catch (error) {
    console.error(error);
  }
};

let lineInfo = {
  "Orange County Line": {
    short_name: "OC",
    to: {
      0: "Oceanside",
      1: "LA Union",
    },
  },
  "Inland Emp.-Orange Co. Line": {
    short_name: "OC-IE",
    to: {
      0: "Oceanside",
      1: "San Bern.",
    },
  },
};

let formatter = (jason) => {
  let res = [];

  jason.forEach((entity) => {
    res.push(`${entity.route} > ${entity.to} ${entity.time} ...`);
  });
  return JSON.stringify(res);
};

export { getStationData };
