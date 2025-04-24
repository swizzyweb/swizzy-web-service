import { ILogger } from "@swizzyweb/swizzy-common";
import { Router } from "express";

export type NewWebRouterClass<GLOBAL_STATE, LOCAL_STATE> = new (
  props: IWebRouterProps<LOCAL_STATE>,
) => IWebRouter<GLOBAL_STATE, LOCAL_STATE>;

export type isWebRouter = { isWebRouter: boolean };
export type SwizzyWebRouterClass<GLOBAL_STATE, LOCAL_STATE> = NewWebRouterClass<
  GLOBAL_STATE,
  LOCAL_STATE
> &
  isWebRouter;

export interface IWebRouter<GLOBAL_STATE, LOCAL_STATE> {
  initialize(props: IWebRouterInitProps<GLOBAL_STATE>): Promise<void>;
  router(): any; //Router;
  getState(): LOCAL_STATE;
  path: string;
}

export interface IWebRouterProps<LOCAL_STATE> {
  state: LOCAL_STATE;
  logger: ILogger<any>;
  path?: string;
}

export interface IWebRouterInitProps<GLOBAL_STATE> {
  globalState?: GLOBAL_STATE;
}

export abstract class WebRouter<GLOBAL_STATE, LOCAL_STATE>
  implements IWebRouter<GLOBAL_STATE, LOCAL_STATE>
{
  static isWebRouter = true;

  /**
   * Configured in initialize.
   */
  actualRouter?: Router;
  state: LOCAL_STATE;
  globalState?: GLOBAL_STATE;
  protected _logger: ILogger<any>;
  path: string;

  constructor(props: IWebRouterProps<LOCAL_STATE>) {
    this.state = props.state;
    this._logger = props.logger;
    this.path = props.path ?? "/";
  }

  // Should we inject state here instead?
  // Then we can init it in the web service?
  // Let's have two states, global and this inner state.
  // Feel free to overide
  async initialize(props: IWebRouterInitProps<GLOBAL_STATE>): Promise<void> {
    this.globalState = props.globalState;
    try {
      this.actualRouter = await this.getInitializedRouter(props);
    } catch (e: any) {
      this._logger.error(`Error initializing router with error: ${e}`);
      throw {
        message: "Error initializing router",
        trace: e.stack ?? new Error("Error initializing router").stack,
        exception: e,
      };
    }
  }

  protected abstract getInitializedRouter(
    props: IWebRouterInitProps<GLOBAL_STATE>,
  ): Promise<Router>;

  router(): Router {
    if (this.actualRouter) {
      return this.actualRouter;
    } else {
      throw {
        name: "RouterNotInitializedError",
        message: `Router is not defined, did you call initialize on this router?`,
      };
    }
  }

  getState(): LOCAL_STATE {
    return this.state;
  }
}
