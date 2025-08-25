import { ILogger } from "@swizzyweb/swizzy-common";
// @ts-ignore
import { NextFunction, Request, Response } from "@swizzyweb/express";
import { SwizzyMiddlewareProps } from "./swizzy-middleware.js";

/**
 * RequestLoggerMiddleware props.
 */
export interface RequestLoggerMiddlewareProps<STATE>
  extends SwizzyMiddlewareProps<STATE> {
  logger: ILogger<any>;
  /**
   * WebService, WebRouter, or WebController state.
   */
  state: STATE;
}
/**
 * Middleware to log request amd response information.
 */
export function RequestLoggerMiddleware<STATE>(
  props: RequestLoggerMiddlewareProps<STATE>,
) {
  let { logger } = props;
  if (!logger) {
    console.warn(
      `WARN!!!!: Logger not provided for RequestLoggerMiddleware, middleware will be a no-op, this will only display once per usage...`,
    );
    return function (req: Request, res: Response, next: NextFunction) {
      next();
    };
  }

  return function (req: Request, res: Response, next: NextFunction) {
    const requestId = req.requestId ?? crypto.randomUUID();
    res.on("finish", () => {
      logger.info(
        `[res-${requestId}]: ${req.method} ${req.originalUrl} ${req.ip} ${res.statusCode}`,
      );
    });

    logger.info(
      `[req-${requestId}]: ${req.method} ${req.originalUrl} ${req.ip}`,
    );
    req.requestId = requestId;
    next();
  };
}
