export let updateLocalCache = (scheme, data) => {
  let now = Date.now();

  localCache[scheme].data = data;
  localCache[scheme].last_updated = now;
};

export let localCache = {
  live: {
    data: null,
    last_updated: null,
    update_interval: 60000, // update with live data every minute
  },
};

export let updateStaticCache = (stationID, data) => {
  let now = Date.now();

  staticCache[stationID] = {};
  staticCache[stationID].data = data;
  staticCache[stationID].last_updated = now;
};

export let staticCache = {
  update_interval: 3600000, // update with db data every hour
};
