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

// Get's all data from metrolink soruce
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

export let getStationData = async (stopID) => {
  let now = Date.now();
  let last_updated = localCache.live.last_updated;
  let update_interval = localCache.live.update_interval;
  let timeSinceUpdate = now - last_updated;

  console.log(
    `Now: ${now} Udpated: ${last_updated} Interval: ${update_interval} Since Update: ${timeSinceUpdate}`,
  );

  if (timeSinceUpdate > update_interval) {
    let data = await getGTFS();
    updateLocalCache("live", data);
    console.log("Cache updated!");
  }
  let feed = localCache.live.data;

  let response = [];
  // let filtered = feed.filter((entity) => entity.trip.routeId === routeID);

  feed.forEach((trip) => {
    let route = trip.trip.routeId;
    let direction = trip.trip.directionId;
    let allStops = trip.stopTimeUpdate;

    allStops.forEach((stop) => {
      // let unix = stop.arrival.time;
      if (stop.stopId == stopID && stop.arrival.time >= Date.now() / 1000) {
        response.push({
          route: lineInfo[route].short_name,
          to: lineInfo[route].to[direction],
          time: stop.arrival.time,
          // time: new Date(unix * 1000).toLocaleTimeString(),
        });
      }
    });
  });
  response.sort((a, b) => a.time - b.time);

  return formatter(response);
};

let formatter = (jason) => {
  let res = [];

  jason.forEach((entity) => {
    let localTime = new Date(entity.time * 1000).toLocaleTimeString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    res.push(`🚆 ${entity.route} > ${entity.to} ${localTime} ...`);
  });
  return JSON.stringify(res);
};
