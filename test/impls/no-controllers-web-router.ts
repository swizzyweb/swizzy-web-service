import {
  WebRouter,
  //IWebRouterProps,
  //  IWebRouterInitProps,
} from "../../dist/router/web-router.js";
import { DefaultStateExporter } from "../../dist/state/state-converter.js";
//import { SwizzyMiddleware } from "../../dist/middleware/index.js";
//import { ILogger } from "@swizzyweb/swizzy-common";
//import { TestRouterState } from "./state/test-router-state.ts";
type SwizzyMiddleware<T> = any;
type IWebRouterProps<T, T2> = any;
type IWebRouterInitProps<T> = any;
type ILogger<T> = any;
interface TestRouterState {}
interface IWebControllerInitProps<T> {}
type WebControllerFunction = any;

export interface INoControllerWebRouterState {
  memoryDb: any;
  currentUserName?: string;
  createdAt?: number;
  creatorName?: string;
}

export interface IMyFirstWebRouterProps
  extends IWebRouterProps<any, TestRouterState> {
  logger: ILogger<any>;
  middleware?: SwizzyMiddleware<TestRouterState>[];
}

export interface INoControllerWebRouterInitProps
  extends IWebRouterInitProps<any> {}

export class NoControllerWebRouter extends WebRouter<any, TestRouterState> {
  constructor(props: IMyFirstWebRouterProps) {
    super({
      name: "MyFirstWebRouter",
      path: "api",
      middleware: props.middleware ?? [],
      ...props,
      webControllerClasses: [],
      stateConverter: DefaultStateExporter,
    });
  }
}
