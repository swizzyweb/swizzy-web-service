import { SwizzyMiddleware, SwizzyMiddlewareProps } from "./swizzy-middleware.js";
import { json } from "express";

export function SwizzyJsonMiddleware<STATE>(propss: SwizzyMiddlewareProps<STATE>) {
  return json();
}
