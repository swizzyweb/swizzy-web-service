import express, { Request, Response, NextFunction } from "express";
import {
  SwizzyMiddleware,
  SwizzyMiddlewareFunction,
  SwizzyMiddlewareProps,
} from "./swizzy-middleware.js";
import path from "path";

/**
 * Adds two numbers together.
 *
 * @param {{string} staticAssetPath - path to static assets directory} props
 * @returns {SwizzyMiddleware} SwizzyStaticMiddleware for hosting static assets as url
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
