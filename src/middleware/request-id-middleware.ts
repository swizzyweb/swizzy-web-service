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
 * Adds a rqeuest id to the swizzy store.
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
