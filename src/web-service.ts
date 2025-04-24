import { BrowserLogger, ILogger } from "@swizzyweb/swizzy-common";

import {
  Application,
  Router,
  // @ts-ignore
} from "@swizzyweb/express";

import { getAppDataPathFromPropsAndInitialize } from "./util/app-data-helper";
import { IWebServiceProps } from "./web-service-props";
import { SwizzyWebRouterClass } from "./web-router";
import { Logger } from "winston";
import { SwizzyWinstonLogger } from "./util/logger";

export const DEFAULT_PORT_NUMBER = 3000;

export interface IRunResult {}

export interface IRunProps {
  //app: Application;
}

export interface IWebService {
  readonly name: string;
  install(props: IRunProps): Promise<IRunResult>;
  uninstall(props: IRunProps): Promise<any>;
  isInstalled(): boolean;
}

export abstract class WebService<GLOBAL_STATE> implements IWebService {
  abstract readonly name: string;
  protected packageName: string;
  protected _isInstalled: boolean;
  protected _logger: ILogger<any>;
  /**
   * @deprecated Use routerClasses install
   */
  protected routers: Router[];
  protected app?: Application;
  protected routerClasses: SwizzyWebRouterClass<GLOBAL_STATE, any>[];
  protected port?: number;
  protected server?: any; // TODO: figure out type for express.listen
  protected appDataPath: string;
  protected state: GLOBAL_STATE;
  protected _installedRouters: Router[];

  constructor(props: IWebServiceProps<GLOBAL_STATE>) {
    this._isInstalled = false;
    this._logger = props.logger ?? new BrowserLogger();
    this.routers = props.routers ?? []; // TODO: remove
    this.routerClasses = props.routerClasses ?? []; // TODO: make required
    this.app = props.app;
    this.port = props.port;
    this.packageName = props.packageName;
    this.appDataPath = getAppDataPathFromPropsAndInitialize(props);
    this.state = props.state ?? ({} as GLOBAL_STATE);
    this._installedRouters = [];
  }

  async install(props: IRunProps): Promise<IRunResult> {
    if (this._logger.getLoggerProps().ownerName !== this.name) {
      this._logger = this._logger.clone({
        ownerName: this.name,
      });
      this._logger.info(`Initialized router for ${this.name}`);
    }
    const logger = this._logger;
    logger.info(`Installing web service ${this.name}`);
    if (this._isInstalled) {
      logger.error(`Service ${this.name} is already installed`);
      return Promise.reject({
        message: `Service ${this.name} is already installed`,
        stack: new Error(`Service ${this.name} is already installed`).stack,
      });
    }

    try {
      logger.info(`Installing routers for ${this.name}`);
      await this.installRouters();
      logger.info(`Installed routers for ${this.name}`);
      this._isInstalled = true;
      logger.info(`Installed ${this.name} successfully`);

      return {
        message: `WebService ${this.name} installed successfully`,
      };
    } catch (e) {
      logger.error(
        `Failed to install ${this.name} with error ${JSON.stringify(e)}`,
      );
      throw {
        message: `WebService ${this.name} failed to install`,
        exception: e,
      };
    }
  }

  async uninstall(props: IRunProps): Promise<any> {
    //const { app } = props;
    const logger = this._logger;
    try {
      logger.info(`Uninstalling ${this.name}`);
      if (!this._isInstalled) {
        logger.error(`Unable to uninstall ${this.name} as it is not installed`);
        return Promise.reject({
          message: `Failed to uninstall non installed service ${this.name}`,
        });
      }

      logger.info(`Uninstalling routers for ${this.name}`);
      await this.uninstallRouters(this.app);
      logger.info(`Uninstalled routers for ${this.name}`);
      this._isInstalled = false;

      logger.info(`Uninstalled ${this.name}`);

      return Promise.resolve({
        message: `WebService ${this.name} uninstalled successfully`,
      });
    } catch (e) {
      logger.error(`Failed to uninstall ${this.name} with exception ${e}`);
      return Promise.reject({
        message: `WebServie ${this.name} failed to uninstall`,
        exception: e,
      });
    }
  }

  isInstalled(): boolean {
    return this._isInstalled;
  }

  protected async installRouters(): Promise<any> {
    let logger = this._logger;
    if (this._isInstalled) {
      logger.error(
        `Service ${this.name} is already installed, cannot install routers`,
      );
      return Promise.reject({
        message: `Service ${this.name} is already installed, cannot install routers`,
      });
    }

    await this.routers.forEach(async (router) => {
      await this.installRouter(router);
    });

    await this.routerClasses.forEach(async (router) => {
      await this.installRouter(router);
    });

    return Promise.resolve({
      message: `Routers installed for Service ${this.name}`,
    });
  }

  protected uninstallRouters(app: Application): Promise<any> {
    const logger = this._logger;
    if (!this._isInstalled) {
      logger.error(
        `Service ${this.name} is not installed, cannot uninstall routers`,
      );
      return Promise.reject({
        message: `Service ${this.name} is not installed, cannot uninstall routers`,
      });
    }

    while (this._installedRouters.length > 0) {
      let router = this._installedRouters.pop();
      // TODO: update
      // @ts-ignore
      app.unuse(router);
    }

    return Promise.resolve({
      message: `Uninstalled routers for Service ${this.name}`,
    });
  }

  /**
   * Override to inject state in subclasses
   * */
  protected getState(): GLOBAL_STATE {
    return this.state;
  }
  async installRouter(
    router: Router | SwizzyWebRouterClass<GLOBAL_STATE, any>,
  ): Promise<void> {
    if (router.isWebRouter ?? false) {
      await this.installWebRouter(router);
      return;
    }

    if (typeof router === typeof Router) {
      this.installExpressRouter(router);
      return;
    }

    throw {
      name: "InvalidRouterForInstall",
      message: `The provided router is invalid for installation on web service: ${this.name}`,
      webService: this.name,
      routerType: typeof router,
      stack: new Error(
        `The provided router is invalid for installation on web service: ${this.name}`,
      ).stack,
    }; // TODO: create actual type
  }

  private async installWebRouter(
    router: SwizzyWebRouterClass<any, any>,
  ): Promise<void> {
    this._logger.info("Hit installWebRouter");
    const instance = new router({
      state: this.getState(),
      logger: this._logger.clone({ ownerName: router.name }),
    });
    await instance.initialize({
      globalState: this.getState(),
    });
    //await router.initialize({ globalState: this.state });
    const expressRouter = await instance.router();
    this.app.use(instance.path, expressRouter);
    this._installedRouters.push(expressRouter);
  }

  private installExpressRouter(router: Router) {
    const logger = this._logger;
    logger.info("Installing router using use");
    // I think I can pull this out into an install router method.
    // There we can determine router type and Override
    // install logic.
    this.app.use(router);
    this._installedRouters.push(router);
  }

  /**
   * @deprecated
   *     Does nothing by default
   */
  protected addMiddleware(router: Router): void {}
}
