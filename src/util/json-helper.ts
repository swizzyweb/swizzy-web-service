import { SwizzyMiddleware } from "../middleware/index.js";
import { StateConverter } from "../state/index.js";

/**
 * Serializes a single `SwizzyMiddleware` to a JSON-compatible descriptor.
 * @param middleware the middleware factory to serialize
 * @returns object containing the middleware function name
 */
export function middlewareToJson(middleware: SwizzyMiddleware<any>): any {
  return { name: middleware.name };
}

/**
 * Serializes an array of `SwizzyMiddleware` factories to JSON-compatible descriptors.
 * @param middleware array of middleware factories to serialize
 * @returns array of objects each containing a middleware function name
 */
export function middlewaresToJson(middleware: SwizzyMiddleware<any>[]) {
  return middleware.map((m) => {
    return middlewareToJson(m);
  });
}

/**
 * Serializes a `StateConverter` function to a JSON-compatible descriptor.
 * @param stateConverter the converter function to serialize
 * @returns object containing the converter function name
 */
export function stateConverterToJson(stateConverter: StateConverter<any, any>) {
  return {
    name: stateConverter.name,
  };
}
