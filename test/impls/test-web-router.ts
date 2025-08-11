import {
  WebRouter,
  //  IWebRouterProps,
  //  IWebRouterInitProps,
} from "../../dist/router/web-router.js";
import { DefaultStateExporter } from "../../dist/state/state-converter.js";
//import { SwizzyMiddleware } from "../../dist/middleware/index.js";
import { NameWebController } from "./controller/name-web-controller.ts";
import { HelloWebController } from "./controller/hello-web-controller.ts";
import { CreatorWebController } from "./controller/creator-web-controller.ts";
//import { ILogger } from "@swizzyweb/swizzy-common";
//import { TestRouterState } from "./state/test-router-state.ts";
type SwizzyMiddleware<T> = any;
interface TestRouterState {}
interface IWebRouterProps<T, T2> {}
type WebControllerFunction = any;
type IWebRouterInitProps<T> = any;
export interface IMyFirstWebRouterState {
  memoryDb: any;
  currentUserName?: string;
  createdAt?: number;
  creatorName?: string;
}

export interface IMyFirstWebRouterProps
  extends IWebRouterProps<any, TestRouterState> {
  logger: any; //ILogger<any>;
  middleware?: SwizzyMiddleware<TestRouterState>[];
}

export interface IMyFirstWebServiceInitProps extends IWebRouterInitProps<any> {}

export class MyFirstWebRouter extends WebRouter<any, TestRouterState> {
  constructor(props: IMyFirstWebRouterProps) {
    super({
      name: "MyFirstWebRouter",
      path: "api",
      middleware: props.middleware,
      webControllerClasses: [
        NameWebController,
        HelloWebController,
        CreatorWebController,
      ],
      stateConverter: DefaultStateExporter,
      logger: props.logger,
    });
  }
}
