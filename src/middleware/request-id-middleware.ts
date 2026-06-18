import { ILogger } from "@swizzyweb/swizzy-common";
import { NextFunction, Request, Response } from "express";
import { SwizzyMiddlewareProps } from "./swizzy-middleware.js";

/**
 * RequestIdMiddleware props.
 */
export interface RequestIdMiddlewareProps<STATE>
  extends SwizzyMiddlewareProps<STATE> {
  /**
   * logger.
   */
  logger: ILogger<any>;
  /**
   * WebService, WebRouter, or WebController state.
   */
  state: STATE;
}

/**
 * Adds a unique request ID to the swizzy store (`req.swizzy.requestId`).
 * If a request ID already exists on the store it is left unchanged.
 */
export function RequestIdMiddleware<STATE>(
  props: RequestIdMiddlewareProps<STATE>,
) {
  return function (req: Request & any, res: Response, next: NextFunction) {
    if (req.swizzy?.requestId) {
      next();
      return;
    }
    if (!req.swizzy) {
      req.swizzy = {};
    }
    req.swizzy.requestId = crypto.randomUUID();
    next();
  };
}
