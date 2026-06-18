import { Request } from "express";
import { SwizzyRequest } from "../model/swizzy-request.js";

/**
 * Returns `true` if the request has been enriched with a Swizzy store.
 * @param req Express request to check
 */
function isSwizzyRequest(req: Request & any): boolean {
  return req.swizzy != undefined;
}

/**
 * Casts an Express request to a `SwizzyRequest`, initializing the
 * swizzy store to an empty object if it is not already set.
 * @param req Express request to cast
 * @returns the same request typed as `SwizzyRequest`
 */
function toSwizzyRequest(req: Request & any): SwizzyRequest {
  req.swizzy = req.swizzy ?? {};
  return req;
}
