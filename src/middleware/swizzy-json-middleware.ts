import { SwizzyMiddleware, SwizzyMiddlewareProps } from "./swizzy-middleware.js";
import { json } from "express";

/**
 * Swizzy middleware that enables JSON body parsing via Express's built-in `json()`.
 * Apply this to a `WebService` or `WebRouter` to accept `application/json` request bodies.
 */
export function SwizzyJsonMiddleware<STATE>(propss: SwizzyMiddlewareProps<STATE>) {
  return json();
}
