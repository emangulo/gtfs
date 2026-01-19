import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { updateLocalCache, localCache } from "./cache.js";

const supabase = createClient(process.env.DB_URL, process.env.DB_KEY);

export let getStaticTable = async (table) => {
  try {
    const { data, error } = await supabase.from(table).select();
    return data;
  } catch (error) {}
};

export let tableGetUpdate = async (table = "routes") => {
  let now = Date.now();

  let last_updated = localCache.static[table].last_updated;
  let update_interval = localCache.static.update_interval;
  let timeSinceUpdate = now - last_updated;

  console.log(
    `Now: ${now} Udpated: ${last_updated} Interval: ${update_interval} Since Update: ${timeSinceUpdate}`,
  );

  if (timeSinceUpdate > update_interval) {
    let data = await getStaticTable(table);
    updateLocalCache("static", table, data);
    console.log("Cache updated!");
  }

  return localCache.static[table].data;
};

// tableGetUpdate("routes");
