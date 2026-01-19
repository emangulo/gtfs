export let updateLocalCache = (scheme, data) => {
  let now = Date.now();

  localCache[scheme].data = data;
  localCache[scheme].last_updated = now;
};

export let localCache = {
  live: {
    data: null,
    last_updated: null,
    update_interval: 60000,
  },
};
