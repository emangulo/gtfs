import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { staticCache, updateStaticCache } from "./cache.js";

const supabase = createClient(process.env.DB_URL, process.env.DB_KEY);

let stationScheduleRawData = async (stationID) => {
  try {
    const { data, error } = await supabase
      .from("stop_times")
      .select()
      .eq("stop_id", stationID);
    return data;
  } catch (error) {
    console.error(error);
  }
};

let upsertLocalCache = async (stationID) => {
  let now = Date.now();

  let last_updated =
    staticCache[stationID] == undefined
      ? 0
      : staticCache[stationID].last_updated;
  let update_interval = staticCache.update_interval;
  let timeSinceUpdate = now - last_updated;

  console.log(
    `Now: ${now} Udpated: ${last_updated} Interval: ${update_interval} Since Update: ${timeSinceUpdate}`,
  );

  if (timeSinceUpdate > update_interval) {
    let data = await stationScheduleRawData(stationID);
    updateStaticCache(stationID, data);
    console.log("Cache updated!");
  }

  return staticCache[stationID].data;
};

export let getStationSchedule = async (stationID) => {
  try {
    let response = upsertLocalCache(stationID);
    return response;
  } catch (error) {
    console.error(error);
  }
};
