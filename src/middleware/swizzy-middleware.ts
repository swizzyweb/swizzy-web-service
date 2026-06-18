import { ILogger } from "@swizzyweb/swizzy-common";
// @deno-types="npm:@types/express@5"
import { NextFunction, Request, Response } from "express";

/**
 * Base props injected into every Swizzy middleware factory.
 */
export interface SwizzyMiddlewareProps<STATE> {
  /** Logger instance provided by the parent router or service. */
  logger: ILogger<any>;
  /** Current state (service, router, or controller level) available to the middleware. */
  state: STATE;
}

/**
 * Standard Express-compatible middleware function.
 * Receives request, response, and next callback.
 */
export type SwizzyMiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

/**
 * A factory function that receives state and logger props and returns
 * a `SwizzyMiddlewareFunction`.
 * Register these on a `WebService`, `WebRouter`, or `WebController`.
 */
export type SwizzyMiddleware<STATE> = (
  props: SwizzyMiddlewareProps<STATE>,
) => SwizzyMiddlewareFunction;
