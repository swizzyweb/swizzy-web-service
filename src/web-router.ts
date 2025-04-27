import { ILogger } from "@swizzyweb/swizzy-common";
// @ts-ignore
import { Router } from "@swizzyweb/express";
import { SwizzyMiddleware } from "./middleware";

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
  middleware?: SwizzyMiddleware<LOCAL_STATE>[];
  appDataPath: string;
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
  private _middleware: SwizzyMiddleware<LOCAL_STATE>[];
  private appDataPath: string;

  constructor(props: IWebRouterProps<LOCAL_STATE>) {
    this.state = props.state;
    this._logger = props.logger;
    this.path = props.path ?? "/";
    this._middleware =
      props.middleware ?? ([] as SwizzyMiddleware<LOCAL_STATE>[]);
    this.appDataPath = props.appDataPath;
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

  /**
   * overide this to configure your router, ensuring you call super first.
   */
  protected getInitializedRouter(
    props: IWebRouterInitProps<GLOBAL_STATE>,
  ): Promise<Router> {
    const router = Router();
    this.installMiddleware({ ...props, router, logger: this._logger });
    return router;
  }

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

  protected installMiddleware(props: IInstallRouterMiddlewareProps) {
    const { router, logger } = props;
    const middleware = this.getMiddleware();
    middleware.forEach((middle: SwizzyMiddleware<LOCAL_STATE>) => {
      router.use(middle({ logger, state: this.state }));
    });
  }

  protected getMiddleware(): SwizzyMiddleware<LOCAL_STATE>[] {
    return this._middleware;
  }
}

export interface IPackageStateProps<GLOBAL_STATE> {
  globalState: GLOBAL_STATE;
}

export interface IInstallRouterMiddlewareProps {
  router: Router;
  logger: ILogger<any>;
}
