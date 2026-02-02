import { WebRouter } from "../../dist/router/web-router.js";
import { DefaultStateExporter } from "../../dist/state/state-converter.js";
//import { SwizzyMiddleware } from "../../dist/middleware/index.js";
import { type NewWebControllerClass } from "../../dist/controller/types.js";
//import { ILogger } from "@swizzyweb/swizzy-common";
//import { TestRouterState } from "./state/test-router-state.ts";
type SwizzyMiddleware<T> = any;
interface TestRouterState {}
interface IWebRouterProps<T, T2> {}
type WebControllerFunction = any;
type IWebRouterInitProps<T> = any;
export interface IConfigurableControllerWebRouterState {
  memoryDb: any;
  currentUserName?: string;
  createdAt?: number;
  creatorName?: string;
}

export interface IConfigurableControllerWebRouterProps
  extends IWebRouterProps<any, TestRouterState> {
  logger: any; //ILogger<any>;
  middleware?: SwizzyMiddleware<TestRouterState>[];
  webControllerClasses: NewWebControllerClass<TestRouterState, any>[];
}

export interface IMyFirstWebServiceInitProps extends IWebRouterInitProps<any> {}

export class ConfigurableControllerWebRouter extends WebRouter<
  any,
  TestRouterState
> {
  constructor(props: IConfigurableControllerWebRouterProps) {
    super({
      name: "ConfigurableControllerWebRouter",
      path: "api",
      middleware: props.middleware,
      webControllerClasses: props.webControllerClasses,
      stateConverter: DefaultStateExporter,
      logger: props.logger,
    });
  }
}
