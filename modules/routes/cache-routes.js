import express from "express";
let router = express.Router();

import { localCache, staticCache } from "../data/cache.js";

router.get("/:type", async (req, res) => {
  if (req.params.type == "live") {
    res.send(localCache);
  } else if (req.params.type == "static") {
    res.send(staticCache);
  }
});

export { router as routerCache };
