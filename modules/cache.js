export let updateLocalCache = (scheme, table, data) => {
  let now = Date.now();

  localCache[scheme][table].data = data;
  localCache[scheme][table].last_updated = now;
};

export let localCache = {
  static: {
    calendar: {
      data: null,
      last_updated: null,
    },
    calendar_dates: {
      data: null,
      last_updated: null,
    },
    fare_attibutes: {
      data: null,
      last_updated: null,
    },
    fare_rules: {
      data: null,
      last_updated: null,
    },
    routes: {
      data: null,
      last_updated: null,
    },
    stop_times: {
      data: null,
      last_updated: null,
    },
    stops: {
      data: null,
      last_updated: null,
    },
    trips: {
      data: null,
      last_updated: null,
    },
    update_interval: 10000, //86400000, // update every 24 hours
  },
  live: {
    table: {
      data: null,
      last_updated: null,
    },
    update_interval: 60000,
  },
};
