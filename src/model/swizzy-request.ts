import { Request } from "express";
import { SwizzyRequestStore } from "./swizzy-request-store.js";

/**
 * Extended Express `Request` that carries the Swizzy request store.
 * Use this type in controllers that need access to `req.swizzy`.
 */
export interface SwizzyRequest extends Request {
  /** Per-request metadata store populated by `SwizzyRequestMiddleware`. */
  swizzy: SwizzyRequestStore;
}
