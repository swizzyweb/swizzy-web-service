import { Request, Response, NextFunction } from "express";
import http from "http";
import https from "https";

/** HTTP or HTTPS server instance. */
export type AnyServer = http.Server | https.Server;

/** Express-compatible middleware function signature. */
export type Middlewares = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void[];
