import { BrowserLogger, ILogger } from "@swizzyweb/swizzy-common";
import {
  Request,
  Response,
  NextFunction,
  Router,
  IRouter,
  Application,
} from "express";
import {
  SwizzyMiddleware,
  SwizzyMiddlewareFunction,
} from "../middleware/index.js";
import { IWebController, NewWebControllerClass } from "../controller/index.js";
import { StateConverter } from "../state/index.js";
import path from "path";
import { middlewaresToJson, stateConverterToJson } from "../util/index.js";
import {
  unuseRouter,
  unuseMiddleware,
  unuseController,
} from "@swizzyweb/express-unuse";
import { trimSlashes } from "../util/trim-slashes.js";

export type NewWebRouterClass<APP_STATE, ROUTER_STATE> = new (
  props: IWebRouterProps<APP_STATE, ROUTER_STATE>,
) => IWebRouter<APP_STATE, ROUTER_STATE>;

export type isWebRouter = { isWebRouter: boolean };
export type SwizzyWebRouterClass<APP_STATE, ROUTER_STATE> = NewWebRouterClass<
  APP_STATE,
  ROUTER_STATE
> &
  isWebRouter;

export interface UninstallRouterProps {
  app: Application;
}

export interface IWebRouter<APP_STATE, ROUTER_STATE> {
  readonly name: string;
  initialize(props: IWebRouterInitProps<APP_STATE>): Promise<void>;
  uninstall(props: UninstallRouterProps): void;
  router(): any; //Router;
  getState(): ROUTER_STATE;
  path: string;
  toJson(): any;
  toString(): string;
}

export interface IWebRouterProps<APP_STATE, ROUTER_STATE> {
  logger: ILogger<any>;
}

installedMiddlewares: (req: Request, res: Response, next: NextFunction) =>
  void [];

export interface IInternalWebRouterProps<APP_STATE, ROUTER_STATE>
  extends IWebRouterProps<APP_STATE, ROUTER_STATE> {
  name: string;
  webControllerClasses: NewWebControllerClass<ROUTER_STATE, any>[];
  path: string;
  stateConverter: StateConverter<APP_STATE, ROUTER_STATE>;

  middleware?: SwizzyMiddleware<ROUTER_STATE>[];
}

export interface IWebRouterInitProps<APP_STATE> {
  appState: APP_STATE;
}

export abstract class WebRouter<APP_STATE, ROUTER_STATE>
  implements IWebRouter<APP_STATE, ROUTER_STATE>
{
  /**
   * Flag for if this is a webrouter, alwaus true for
   * all web routers
   */
  static isWebRouter = true;

  /**
   * Web router name
   */
  public readonly name: string;

  /*
   * Web router url path
   */
  public readonly path: string;

  /**
   * Actual express router initialized in initialize method
   */
  actualRouter?: IRouter;

  /*
   * Router state
   */
  state?: ROUTER_STATE;

  /**
   * logger
   */
  protected logger: ILogger<any>;

  /**
   * Router middleware
   */
  protected readonly middleware: SwizzyMiddleware<ROUTER_STATE>[];
  /**
   * Controller classes to be attached to this router
   */
  protected readonly webControllerClasses: NewWebControllerClass<
    ROUTER_STATE,
    any
  >[];

  /**
   * Installed web controllers, initialized in initialize()
   */
  private readonly installedControllers: IWebController<ROUTER_STATE, any>[];

  /**
   * State converter that converts app state to router state
   */
  private stateConverter: StateConverter<APP_STATE, ROUTER_STATE>;

  private installedMiddlewares: SwizzyMiddlewareFunction[];

  constructor(props: IInternalWebRouterProps<APP_STATE, ROUTER_STATE>) {
    this.name = props.name;
    this.logger = props.logger; //.clone({ ownerName: this.name });
    this.installedControllers = [];
    this.middleware = props.middleware ?? [];
    this.webControllerClasses = props.webControllerClasses;
    this.path = trimSlashes(props.path);
    this.stateConverter = props.stateConverter;
    this.installedMiddlewares = [];
  }

  /**
   * Initializes router, needs to be called before calling router() method.
   */
  async initialize(props: IWebRouterInitProps<APP_STATE>): Promise<void> {
    this.logger.debug(`Initializing router ${this.name}`);
    if (this.isInitialized()) {
      this.logger.error(`WebRouter already initialized ${this.name}`);
      throw {
        error: `WebRouterAlreadyInitializedException`,
        message: "Web router is already initialized",
        stack: new Error(
          `WebRouterAlreadyInitializedException: Web router already initialized`,
        ).stack,
      };
    }
    this.logger.debug(`Converting app state to router state`);
    this.state = await this.stateConverter({ state: props.appState });

    this.logger.debug(`Converted app stsate to router state`);
    try {
      this.logger.debug(`Getting initialized router`);
      this.actualRouter = await this.getInitializedRouter(props);

      this.logger.debug(`Got initialized router`);
      this.logger.debug(`Installing web controllers`);
      await this.installControllers(props);

      this.logger.debug("Installed web controllers");
      this.logger.debug(`${this.name} router initialized`);
    } catch (e: any) {
      this.logger.error(`Error initializing router with error`, e);
      throw {
        message: "Error initializing router",
        stack: e.stack ?? new Error("Error initializing router").stack,
        error: e,
      };
    }
  }
  isInitialized() {
    if (this.installedControllers.length > 0) {
      this.logger.warn(
        `Web controllers already installed on web router ${this.name}`,
      );
      return true;
    }

    if (this.actualRouter) {
      this.logger.warn(`Router already initialized on web router ${this.name}`);
      return true;
    }

    return false;
  }
  /**
   * overide this to configure your router, ensuring you call super first.
   */
  protected async getInitializedRouter(
    props: IWebRouterInitProps<APP_STATE>,
  ): Promise<Router> {
    const router = await Router();
    this.logger.debug(`Installing middleware`);
    await this.installMiddleware({ ...props, router, logger: this.logger });
    this.logger.debug(`Installed middleware`);
    return router;
  }

  private async installControllers(props: IWebRouterInitProps<APP_STATE>) {
    const logger = this.logger;
    logger.debug("Installing web controllers");
    for (const clazz of this.webControllerClasses) {
      await this.installController(clazz);
    }

    logger.debug(`Installed web controllers`);
  }

  private async installController(
    clazz: NewWebControllerClass<ROUTER_STATE, any>,
  ) {
    const logger = this.logger;
    logger.debug(`Installing controller ${clazz.name}`);

    const webController = new clazz({
      logger: logger.clone({ owner: clazz.name }),
    });

    logger.debug(`Initializing controller`);
    await webController.initialize({ routerState: this.getState() });

    logger.debug("Initialized controller");
    const installableController = webController.installableController();

    if (!this.actualRouter) {
      throw new Error(`Unexpected error, actualRouter is not defined`);
    }

    //    actualMethod
    this.actualRouter[`${webController.method}`](
      path.join("/", installableController.action),
      [...installableController.middleware],
      installableController.controller,
    );
    this.installedControllers.push(webController);
    this.logger.debug(`Installed controller ${clazz.name}`);
    this.logger.debug(
      `Installed webcontroller ${webController.action} - ${webController.name} - ${installableController.controller}`,
    );
  }

  uninstall(props: UninstallRouterProps): void {
    const { app } = props;
    const logger = this.logger ?? new BrowserLogger({});

    this.uninstallControllers();
    this.uninstallMiddleware();

    let index = unuseRouter(app, this.router())! as number;
    if (typeof index !== "number") {
      throw new Error(
        `Error uninsalling router ${this.name} as it was not found`,
      );
    }

    logger.debug(`Uninstalled router ${this.router().name}`);
    this.actualRouter == undefined;
  }

  private uninstallMiddleware() {
    const logger = this.logger;
    const router = this.router();
    logger.error(`Uninstalling middleware from router ${router.name}`);
    while (this.installedMiddlewares.length > 0) {
      const middleware = this.installedMiddlewares.pop()!;

      logger.debug(
        `Uninstalling middleware ${middleware.name} from router ${router.name}`,
      );
      unuseMiddleware(router, middleware);
      logger.debug(
        `Uninstalled middleware ${middleware.name} from router ${router.name}`,
      );
    }
  }

  private uninstallControllers() {
    const logger = this.logger;
    logger.error(`Uninstalling controllers`);
    const router = this.router();

    while (this.installedControllers.length > 0) {
      const webController = this.installedControllers.pop()!;
      const { action: rawAction, method } = webController;
      const path = trimSlashes(rawAction);
      unuseController(router, { path, method });
      logger.debug(
        `uninstalled middleware ${webController.name} from router ${router.name}`,
      );
    }
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

  getState(): ROUTER_STATE {
    return this.state ?? ({} as ROUTER_STATE);
  }

  protected async installMiddleware(
    props: IInstallRouterMiddlewareProps,
  ): Promise<void> {
    const { logger } = props;
    const middleware = this.getMiddleware();
    if (middleware.length < 1) {
      this.logger.debug(`No router middleware to install for router`);
      return;
    }
    for (const middle of middleware) {
      this.logger.debug(`Installing middleware ${middle.name}`);
      const mid = middle({ logger, state: this.getState() });
      this.installedMiddlewares.push(mid);
      await props.router.use(mid);
      this.logger.debug(`Installed middlware ${middle.name}`);
    }
  }

  protected getMiddleware(): SwizzyMiddleware<ROUTER_STATE>[] {
    return this.middleware;
  }

  toJson() {
    const middleware = middlewaresToJson(this.middleware);
    const controllers = this.installedControllers.map((c) => {
      return c.toJson();
    });
    const { name, logger, path } = this;
    return {
      name,
      logger: undefined,
      webControllerClasses: this.webControllerClasses,
      installedControllers: controllers,
      path,
      middleware,
      stateConverter: stateConverterToJson(this.stateConverter),
    };
  }

  toString(): string {
    return JSON.stringify(this.toJson());
  }
}

export interface IPackageStateProps<APP_STATE> {
  appState: APP_STATE;
}

export interface IInstallRouterMiddlewareProps {
  router: Router;
  logger: ILogger<any>;
}
