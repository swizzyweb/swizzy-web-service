import { ILogger } from "@swizzyweb/swizzy-common";
// @deno-types="npm:@types/express@5"
import { NextFunction, Request, Response } from "express";

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
