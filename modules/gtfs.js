import "dotenv/config";

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
        if (stop.stopId == stopID && stop.arrival.time >= Date.now() / 1000) {
          let unix = stop.arrival.time;
          let timestamp = new Date(unix * 1000).toLocaleTimeString();
          response.push(
            `{${lineInfo[route].short_name} -> ${lineInfo[route].to[direction]} ${timestamp}}`,
          );
        }
      });
    });

    const sorted = response.sort((a, b) => {
      // extract the time part (e.g. "3:01:00 PM")
      const timeA = a.match(/\d{1,2}:\d{2}:\d{2}\s[AP]M/)[0];
      const timeB = b.match(/\d{1,2}:\d{2}:\d{2}\s[AP]M/)[0];

      // convert to Date objects for comparison
      const dateA = new Date(`1970-01-01 ${timeA}`);
      const dateB = new Date(`1970-01-01 ${timeB}`);

      return dateA - dateB;
    });

    return sorted;
  } catch (error) {
    console.error(error);
  }
};

let lineInfo = {
  "Orange County Line": {
    short_name: "OC",
    to: {
      0: "Oceanside",
      1: "LA",
    },
  },
  "Inland Emp.-Orange Co. Line": {
    short_name: "OC-IE",
    to: {
      0: "Oceanside",
      1: "San Bernardino",
    },
  },
};

export { getStationData };
