import "dotenv/config";

const API_KEY = process.env.API_KEY;

export let checkAPIKey = (req, res, next) => {
  const apiKey = req.query.api_key;

  if (apiKey === API_KEY) {
    next();
  } else {
    res.status(403).send("Invalid API Key");
  }
};
