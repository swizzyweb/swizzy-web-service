import { ILogger } from "@swizzyweb/swizzy-common";

import {
  Application,
  Router,
  // @ts-ignore
} from "@swizzyweb/express";

import {
  IWebRouter,
  SwizzyWebRouterClass,
  WebRouter,
} from "../router/web-router.js";
import path from "path";
import {
  SaveInstanceProps,
  IInternalWebServiceProps,
  UseRouterProps,
  UseRouterResult,
  UninstallRouterProps,
} from "./interface.js";
import { assertOrThrow } from "../util/assertion-util.js";
import { SwizzyMiddleware } from "../middleware/index.js";
import { middlewaresToJson, middlewareToJson } from "../util/index.js";

export interface IRunResult {}

export interface IRunProps {
  //app: Application;
}

export interface IWebService {
  /**
   * Friendly name of webservice.
   */
  readonly name: string;

  /**
   * instanceId of WebService.
   */
  readonly instanceId: string;

  /**
   * Installs the WebService to the app.
   * @param props for install
   */
  install(props: IRunProps): Promise<IRunResult>;

  /**
   * Uninstalls the WebService from the app.
   * @param props for uninstall
   */
  uninstall(props: IRunProps): Promise<any>;

  /**
   * Whether the app is installed or not.
   */
  isInstalled(): boolean;

  toJson(): any;
  toString(): string;
}
/**
 * Base web service class to be implemented.
 */
export abstract class WebService<APP_STATE> implements IWebService {
  public readonly name: string;
  public readonly instanceId: string;
  public readonly port: number;
  public readonly packageName: string;
  public path: string;

  protected logger: ILogger<any>;
  protected state: APP_STATE;

  private _isInstalled: boolean;
  private app: Application;
  private routerClasses: SwizzyWebRouterClass<APP_STATE, any>[];
  private installedRouters: IWebRouter<APP_STATE, any>[];
  private middleware: SwizzyMiddleware<APP_STATE>[];

  /**
   * Constructor for WebService base class.
   * Note: For subclasses of this, it is recommended to use {@link IWebServiceProps}
   * to simplify user implementation usage.
   * @param props internal props
   */
  constructor(props: IInternalWebServiceProps<APP_STATE>) {
    this.name = props.name;
    this.instanceId = crypto.randomUUID();
    this._isInstalled = false;
    this.logger = props.logger.clone({ ownerName: this.name });
    this.routerClasses = props.routerClasses;
    this.app = props.app;
    this.port = props.port;
    this.packageName = props.packageName;
    this.state = props.state;
    this.installedRouters = [];
    this.path = props.path;
    this.middleware = props.middleware ?? [];
  }
  public async install(props: IRunProps): Promise<IRunResult> {
    const logger = this.logger;
    logger.debug(`Installing web service ${this.name}`);
    this.validateNotInstalled();

    try {
      logger.debug(`Installing routers for ${this.name}`);
      await this.installRouters();
      logger.debug(`Installed routers for ${this.name}`);
      this._isInstalled = true;
      logger.debug(`Installed ${this.name} successfully`);

      return {
        message: `WebService ${this.name} installed successfully`,
      };
    } catch (e) {
      logger.error(
        `Failed to install ${this.name} with error ${JSON.stringify(e)}`,
      );
      throw {
        message: `WebService ${this.name} failed to install`,
        error: e,
      };
    }
  }

  private validateNotInstalled(): void {
    const logger = this.logger;
    logger.debug(`Validating WebService ${this.name} is not installed`);
    if (this.isInstalled()) {
      logger.error(`Service ${this.name} is already installed`);
      throw {
        message: `Service ${this.name} is already installed`,
        stack: new Error(`Service ${this.name} is already installed`).stack,
      };
    }

    logger.debug(`WebService ${this.name} is not installed as expected`);
  }

  public isInstalled(): boolean {
    return this._isInstalled;
  }

  private async installRouters(): Promise<any> {
    let logger = this.logger;
    logger.debug(`Installing routers for WebService ${this.name}`);
    for (const router of this.routerClasses) {
      await this.installRouter(router);
    }
    logger.debug(`Installed routers for WebService ${this.name}`);

    return {
      message: `Routers installed for WebService ${this.name}`,
    };
  }

  private async installRouter(
    router: SwizzyWebRouterClass<APP_STATE, any>,
  ): Promise<void> {
    const logger = this.logger;
    logger.debug(`Installing router ${router.name}`);

    const instance = new router({
      logger,
    });
    const state = this.getState();
    await instance.initialize({
      appState: state,
    });

    const { expressRouter } = await this.useRouter({
      instance,
    });

    await this.saveInstance({ instance, router: expressRouter });

    logger.debug(`Installed router ${router.name}`);
  }

  protected getState(): APP_STATE {
    return this.state;
  }

  private async useRouter(
    props: UseRouterProps<APP_STATE, any>,
  ): Promise<UseRouterResult> {
    const logger = this.logger;
    const { instance } = props;
    const expressRouter = instance.router();

    logger.debug(`Calling app.use(router) with ${instance.name}`);
    await this.app.use(
      path.join("/", this.path, "/", instance.path),
      this.middleware.map((middle) =>
        middle({ logger, state: this.getState() }),
      ),
      expressRouter,
    );
    logger.debug(`Called app.use(router) with ${instance.name}`);

    return { expressRouter: expressRouter };
  }

  private async saveInstance(
    props: SaveInstanceProps<IWebRouter<APP_STATE, any>, Router>,
  ): Promise<void> {
    const logger = this.logger;
    const { instance, router } = props;
    logger.debug("Saving router instance in WebService");
    assertOrThrow({
      args: { instance: instance.router(), router: router },
      errorMessage:
        "Provided router does not match instance router when attempting to save instance",
      assertion: (args) => instance.router() === router,
    });

    logger.debug(`Pushing instance ${router.name} to installedRouters`);
    this.installedRouters.push(instance);
    logger.debug(`Pushed instance ${router.name} to installedRouters`);

    logger.debug("Saved router instance in WebService");
  }

  public async uninstall(props: IRunProps): Promise<any> {
    const logger = this.logger;

    try {
      logger.debug(`Uninstalling ${this.name}`);

      logger.debug(`Uninstalling routers for ${this.name}`);
      await this.uninstallRouters();
      logger.debug(`Uninstalled routers for ${this.name}`);
      this._isInstalled = false;

      logger.debug(`Uninstalled ${this.name}`);

      return {
        message: `WebService ${this.name} uninstalled successfully`,
      };
    } catch (e: any) {
      logger.error(`Failed to uninstall ${this.name} with exception ${e}`);
      throw {
        message: `WebService ${this.name} failed to uninstall`,
        error: e,
      };
    }
  }

  private async uninstallRouters(): Promise<any> {
    const logger = this.logger;
    logger.debug(`Uninstalling routers for WebService ${this.name}`);
    while (this.installedRouters.length > 0) {
      let router = this.installedRouters.pop()!;
      await this.uninstallRouter({ router });
    }

    logger.debug(`Uninstalled routers`);
    return {
      message: `Uninstalled routers for Service ${this.name}`,
    };
  }

  private async uninstallRouter(
    props: UninstallRouterProps<APP_STATE, any>,
  ): Promise<void> {
    const logger = this.logger;
    const { router } = props;
    const app = this.app;

    logger.debug(`Uninstalling router ${router.name}`);
    const expressRouter = router.router();
    logger.debug(`Unusing router ${router.name}`);
    await app.unuse(path.join("/", this.path, "/", router.path), expressRouter);
    logger.debug(`Unused router ${router.name}`);
    logger.debug(`Uninstalled router ${router.name}`);
  }

  toJson(): {
    name: string;
    instanceId: string;
    isInstalled: boolean;
    logger: any;
    port: number;
    packageName: string;
    state: any;
    installedRouters: any;
    path: string;
    middleware: any;
  } {
    const installedRouters = this.installedRouters.map((installedRouter) =>
      installedRouter.toJson(),
    );
    const middleware = middlewaresToJson(this.middleware);
    const { name, instanceId, _isInstalled, logger, port, packageName, path } =
      this;
    return {
      name,
      instanceId,
      isInstalled: _isInstalled,
      port,
      packageName,
      path,
      logger: undefined,
      state: undefined,
      installedRouters,
      middleware,
    };
  }
  toString(): string {
    return JSON.stringify({ service: this.toJson() });
  }
}
export interface IInstallMiddlewareProps {
  app: Application;
  logger: ILogger<any>;
}
export interface IInstallMiddlewareToRouterProps {
  router: Router;
  logger: ILogger<any>;
}
