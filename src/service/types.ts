import { Request, Response, NextFunction } from "express";
import http from "http";
import https from "https";

export type AnyServer = http.Server | https.Server;

export type Middlewares = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void[];
