// @ts-ignore
import { Request } from "@swizzyweb/express";

export interface SwizzyRequest extends Request {
  swizzy: SwizzyRequestStore;
}
