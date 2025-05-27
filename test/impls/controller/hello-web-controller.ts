import {
  IWebControllerInitProps,
  RequestMethod,
  WebController,
  WebControllerFunction,
} from "../../../src/controller";
import { DefaultStateExporter } from "../../../src/state";
// @ts-ignore
import { Request, Response } from "@swizzyweb/express";
import { TestRouterState } from "../state/test-router-state";

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
    return (req: Request, res: Response) => {
      res.json({ message: `Hello ${getState()?.currentUserName}!` });
    };
  }
}
