import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

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

export let getStationSchedule = async (stationID) => {
  try {
    let response = stationScheduleRawData(stationID);
    return response;
  } catch (error) {
    console.error(error);
  }
};
