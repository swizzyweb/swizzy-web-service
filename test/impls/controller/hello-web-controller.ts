import {
  //  IWebControllerInitProps,
  RequestMethod,
  WebController,
  //  WebControllerFunction,
} from "../../../dist/controller/index.js";
import { DefaultStateExporter } from "../../../dist/state/index.js";
// @ts-ignore
//import { Request, Response } from "@swizzyweb/express";
import express from "@swizzyweb/express";
//import { TestRouterState } from "../state/test-router-state.ts";

interface TestRouterState {}
interface IWebControllerInitProps<T> {}
type WebControllerFunction = any;

export interface HelloWebControllerState {
  currentUserName?: string;
}

export class HelloWebController extends WebController<
  TestRouterState,
  HelloWebControllerState
> {
  constructor(props: any) {
    super({
      name: "HelloController",
      stateConverter: DefaultStateExporter,
      action: "hello",
      method: RequestMethod.get,
      logger: props.logger,
      middleware: props.middleware,
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<any>,
  ): Promise<WebControllerFunction> {
    const getState = this.getState.bind(this);
    return (req: express.Request, res: express.Response) => {
      res.json({ message: `Hello ${getState()?.currentUserName}!` });
    };
  }
}
