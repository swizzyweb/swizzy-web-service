import { BrowserLogger, ILogger } from "@swizzyweb/swizzy-common";
import { isPortInUse } from "./util/port-checker";
// @ts-ignore
import express, { Application, Router, Request, Response } from "@swizzyweb/express";
import { getAppDataPathFromProps,  getAppDataPathFromPropsAndInitialize } from './util/app-data-helper';
import { IWebServiceProps } from './web-service-props';
import { IWebRouter, WebRouter } from './web-router';

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


export abstract class WebService implements IWebService {
  abstract readonly name: string;
  protected packageName: string;
  protected _isInstalled: boolean;
  protected _logger: ILogger;
  protected routers: Router[];
  protected app?: Application;
  protected port?: number;
  protected server?: any; // TODO: figure out type for express.listen
  protected appDataPath: string;
  protected state?: any;
  constructor(props: IWebServiceProps) {
    this._isInstalled = false;
    this._logger = props.logger ?? new BrowserLogger();
    this.routers = props.routers!;
    this.app = props.app;
    this.port = props.port;
    this.packageName = props.packageName;
    this.appDataPath = getAppDataPathFromPropsAndInitialize(props);
    this.state = props.state;

  }

  async install(props: IRunProps): Promise<IRunResult> {
    const logger = this._logger;
    logger.info(`Installing web service ${this.name}`);
    if (this._isInstalled) {
      logger.error(`Service ${this.name} is already installed`);
      return Promise.reject({
        message: `Service ${this.name} is already installed`,
      });
    }

    try {
      logger.info(`Installing routers for ${this.name}`);
      this.installRouters();
      logger.info(`Installed routers for ${this.name}`);
      this._isInstalled = true;
      logger.info(`Installed ${this.name} successfully`);

      return Promise.resolve({
        message: `WebService ${this.name} installed successfully`,
      });
    } catch (e) {
      logger.error(`Failed to install ${this.name} with error ${JSON.stringify(e)}`);
      return Promise.reject({
        message: `WebService ${this.name} failed to install`,
        exception: e,
      });
    }
  }

  uninstall(props: IRunProps): Promise<any> {
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
      this.uninstallRouters(this.app);
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

  protected installRouters(): Promise<any> {
    let logger = this._logger;
    if (this._isInstalled) {
      logger.error(
        `Service ${this.name} is already installed, cannot install routers`,
      );
      return Promise.reject({
        message: `Service ${this.name} is already installed, cannot install routers`,
      });
    }
    const state = this.getState();
    this.routers.forEach(async (router) => {
       this.addMiddleware(router); 
      //logger.info("Installing router using use");
      // I think I can pull this out into an install router method.
      // There we can determine router type and Override
      // install logic.
      //this.app.use(router);
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

    this.routers.forEach((router) => {
      // TODO: update
      // @ts-ignore
      app.unuse(router);
    });

    return Promise.resolve({
      message: `Uninstalled routers for Service ${this.name}`,
    });
  }

  /**
* Override to inject state in subclasses
* */
  protected getState(): any {
    return this.state;
  }

  async installRouter(router: Router[] | IWebRouter<any, any>[]): Promise<void> {
      // TODO: since we can't check if it implements
    // the base interface, we check the base impl.
    // If we add more impls, we will need to check them here.
    // We could do something like [typeof WebRouter, typeof SomeOtherImpl]
    // .includes(typeof router)...
    if (router instanceof WebRouter) {
      await this.installWebRouter(router);
      return;
    }

    if (typeof router === typeof Router) {
      this.installExpressRouter(router);
      return;
    }

    throw {name: "InvalidRouterForInstall",
      message: `The provided router is invalid for installation on web service: ${this.name}`,
      webService: this.name,
      routerType: typeof router,
    }; // TODO: create actual type
  }

  private async installWebRouter(router: IWebRouter<any, any>): Promise<void> {
    await router.initialize({globalState: this.state});
    this.app.use(router.router());
  }

  private installExpressRouter(router: Router) {
    const logger = this._logger;
    logger.info("Installing router using use");
      // I think I can pull this out into an install router method.
      // There we can determine router type and Override
      // install logic.
      this.app.use(router);

  }

    /**
*     Does nothing by default
* */
    protected addMiddleware(router: Router): void {
      
    }
}

