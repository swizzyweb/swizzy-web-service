import {
  IWebControllerInitProps,
  RequestMethod,
  WebController,
  WebControllerFunction,
} from "../../../src/controller";
import { DefaultStateExporter } from "../../../src/state/state-converter";
// @ts-ignore
import { Request, Response, json } from "@swizzyweb/express";
import { TestRouterState } from "../state/test-router-state";

export interface NameWebControllerState {
  currentUserName?: string;
}

export class NameWebController extends WebController<
  TestRouterState,
  NameWebControllerState
> {
  constructor(props: any) {
    super({
      name: "NameController",
      stateConverter: DefaultStateExporter,
      method: RequestMethod.post,
      action: "name",
      logger: props.logger,
      middleware: [...(props.middleware ?? [])],
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<TestRouterState>,
  ): Promise<WebControllerFunction> {
    const { logger } = this;
    const getState = this.getState.bind(this);
    return async function NameController(req: Request, res: Response) {
      logger.info("Name controller entered");
      //console.error(
      //  `Hit name controller with body: ${JSON.stringify(req.body)}`,
      //);
      const oldUserName = getState()?.currentUserName;
      //console.error(`getState() ${JSON.stringify(getState())}`);
      //      res.contentType("application/json");
      try {
        getState()!.currentUserName = req.body.userName;
        res.json({
          message: `Username has been updated from ${oldUserName} to ${getState()?.currentUserName}`,
        });
      } catch (e: any) {
        res.status(403);
        res.json({ message: "hello from name controller" });
      }
    };
  }
}
