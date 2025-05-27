// @ts-ignore
import { Request } from "@swizzyweb/express";
import { SwizzyRequest } from "../model/swizzy-request";

function isSwizzyRequest(req: Request): boolean {
  return req.swizzy != undefined;
}

function toSwizzyRequest(req: Request): SwizzyRequest {
  req.swizzy = req.swizzy ?? {};
  return req;
}
