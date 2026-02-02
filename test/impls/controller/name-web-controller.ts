import {
  RequestMethod,
  WebController,
} from "../../../dist/controller/index.js";
import { DefaultStateExporter } from "../../../dist/state/state-converter.js";
import express from "express";

interface TestRouterState {}
interface IWebControllerInitProps<T> {}
type WebControllerFunction = any;

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
      middleware: [...(props.middleware ?? [express.json])],
    });
  }

  protected async getInitializedController(
    props: IWebControllerInitProps<TestRouterState>,
  ): Promise<WebControllerFunction> {
    const { logger } = this;
    const getState = this.getState.bind(this);
    return async function NameController(
      req: express.Request,
      res: express.Response,
    ) {
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
        logger.error(e);
        res.status(403);
        res.json({ message: "hello from name controller" });
      }
    };
  }
}
