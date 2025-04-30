import { ILogger } from "@swizzyweb/swizzy-common";
// @ts-ignore
import { NextFunction, Request, Response } from "@swizzyweb/express";
import { SwizzyMiddlewareProps } from "./swizzy-middleware";

export interface RequestIdMiddlewareProps<STATE>
  extends SwizzyMiddlewareProps<STATE> {
  logger: ILogger<any>;
  state: STATE;
}
export function RequestIdMiddleware<STATE>(
  props: RequestIdMiddlewareProps<STATE>,
) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.swizzy?.requestId) {
      next();
      return;
    }

    req.swizzy.requestId = crypto.randomUUID();
    next();
  };
}
