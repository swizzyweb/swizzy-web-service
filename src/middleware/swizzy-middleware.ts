import { ILogger } from "@swizzyweb/swizzy-common";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { SwizzyRequestMiddleware } from "./swizzy-request-middleware.js";

/**
 * Base middleware props
 */
export interface SwizzyMiddlewareProps<STATE> {
  logger: ILogger<any>;
  state: STATE;
}

/**
 * Middleware function for router or classes
 */
export type SwizzyMiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

/**
 * Middleware for router or controllers
 */
export type SwizzyMiddleware<STATE> = (
  props: SwizzyMiddlewareProps<STATE>,
) => SwizzyMiddlewareFunction;
