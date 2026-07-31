import "dotenv/config";
import type { Request, Response, NextFunction } from "express";

const API_KEY = process.env.API_KEY;

export let checkAPIKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.query.api_key;

  if (apiKey === API_KEY) {
    next();
  } else {
    res.status(403).send("Invalid API Key");
  }
};
