import { ILogger } from "@swizzyweb/swizzy-common";
// @ts-ignore
import { NextFunction, Request, Response } from "@swizzyweb/express";

export interface SwizzyMiddlewareProps<STATE> {
  logger: ILogger<any>;
  state: STATE;
}
export type SwizzyMiddleware<STATE> = (
  props: SwizzyMiddlewareProps<STATE>,
) => (req: Request, res: Response, next: NextFunction) => void;
