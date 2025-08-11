import { SwizzyMiddleware } from "../middleware/index.js";
import { StateConverter } from "../state/index.js";

export function middlewareToJson(middleware: SwizzyMiddleware<any>): any {
  return { name: middleware.name };
}

export function middlewaresToJson(middleware: SwizzyMiddleware<any>[]) {
  return middleware.map((m) => {
    return middlewareToJson(m);
  });
}

export function stateConverterToJson(stateConverter: StateConverter<any, any>) {
  return {
    name: stateConverter.name,
  };
}
