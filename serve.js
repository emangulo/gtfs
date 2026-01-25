import express from "express";
import { routerLive } from "./modules/routes/live-routes.js";
import { routerStatic } from "./modules/routes/static-routes.js";

let PORT = process.env.PORT || 3000;
let app = express();

const API_KEY = process.env.API_KEY;

let checkAPIKey = (req, res, next) => {
  const apiKey = req.query.api_key;

  if (apiKey === API_KEY) {
    next();
  } else {
    res.status(403).send("Invalid API Key");
  }
};
app.use(checkAPIKey);

// Routes
app.use("/live", routerLive);
app.use("/static", routerStatic);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
