// @deno-types="npm:@types/express@5"
import { Request, Response, NextFunction } from "express";

// @deno-types="npm:@types/express@5"
import * as express from "express";
import {
  SwizzyMiddleware,
  SwizzyMiddlewareFunction,
  SwizzyMiddlewareProps,
} from "./swizzy-middleware.js";
import path from "path";

/**
 * Creates a `SwizzyMiddleware` factory that serves static assets from a local directory.
 *
 * @param props.staticAssetsPath - absolute or relative path to the static assets directory
 * @returns a `SwizzyMiddleware` that serves files via Express's `static()` handler
 */
export function SwizzyStatic<STATE>(props: {
  staticAssetsPath: string;
}): SwizzyMiddleware<STATE> {
  const { staticAssetsPath } = props;

  return function SwizzyStaticMiddleware(
    props: SwizzyMiddlewareProps<STATE>,
  ): SwizzyMiddlewareFunction {
    return function SwizzyStaticMiddlewareFunction(
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      express.static(staticAssetsPath)(req, res, next);
    };
  };
}
