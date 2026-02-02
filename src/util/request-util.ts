import { Request } from "express";
import { SwizzyRequest } from "../model/swizzy-request.js";

function isSwizzyRequest(req: Request & any): boolean {
  return req.swizzy != undefined;
}

function toSwizzyRequest(req: Request & any): SwizzyRequest {
  req.swizzy = req.swizzy ?? {};
  return req;
}
