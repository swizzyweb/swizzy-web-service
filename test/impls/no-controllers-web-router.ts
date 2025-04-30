import {
  WebRouter,
  IWebRouterProps,
  IWebRouterInitProps,
} from "../../src/router/web-router";
import { DefaultStateExporter } from "../../src/state/state-converter";
import { SwizzyMiddleware } from "../../src/middleware";
import { ILogger } from "@swizzyweb/swizzy-common";
import { TestRouterState } from "./state/test-router-state";

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
