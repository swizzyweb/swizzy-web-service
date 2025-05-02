import {
  IWebControllerInitProps,
  RequestMethod,
  WebController,
  WebControllerFunction,
} from "../../../src/controller";
import { DefaultStateExporter } from "../../../src/state";
// @ts-ignore
import { Request, Response, json } from "@swizzyweb/express";
import { TestRouterState } from "../state/test-router-state";

export interface CreatorWebControllerState {
  createdAt?: number;
  creatorName?: string;
}

export class CreatorWebController extends WebController<
  TestRouterState,
  CreatorWebControllerState
> {
  constructor(props: any) {
    super({
      ...props,
      name: "CreatorController",
      stateConverter: DefaultStateExporter,
      action: "creator",
      method: RequestMethod.get,
      logger: props.logger,
      middleware: [...(props.middleware ?? []), json],
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<TestRouterState>,
  ): Promise<WebControllerFunction> {
    const logger = this.logger;
    logger.debug("Got init web controller");
    const getState = this.getState.bind(this);
    return function creatorController(req: Request, res: Response) {
      logger.error("Create controller entered");
      //res.send("hello");
      //return;
      try {
        res.json({
          message: `The creator of this app is ${getState()?.creatorName}`,
          createdAt: getState()?.createdAt,
        });
      } catch (e) {
        //        console.error(e);
        res.statusCode(503);
        res.json({});
      }
    };
  }
}
