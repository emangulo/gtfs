import express from "express";
import { checkAPIKey } from "./modules/routes/authenticate.js";
import { routerLive } from "./modules/routes/live-routes.js";
import { routerStatic } from "./modules/routes/static-routes.js";
import { routerCache } from "./modules/routes/cache-routes.js";

let PORT = process.env.PORT || 3000;
let app = express();

app.get("/callback", (req, res) => {
  console.log(req.query.code);
  res.send("Logged!");
});

app.use(checkAPIKey);

// Routes
app.use("/live", routerLive);
app.use("/static", routerStatic);
app.use("/cache", routerCache);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
