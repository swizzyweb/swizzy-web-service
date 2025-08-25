// @ts-ignore
import { Request, Response, NextFunction } from "@swizzyweb/express";
import {
  SwizzyMiddleware,
  SwizzyMiddlewareFunction,
  SwizzyMiddlewareProps,
} from "./swizzy-middleware.js";

/**
 * Initializes the swizzy request store.
 */
export const SwizzyRequestMiddleware: SwizzyMiddleware<any> =
  function SwizzyRequestMiddlewareFunction(props: SwizzyMiddlewareProps<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      req.swizzy = {};
      next();
    };
  };
