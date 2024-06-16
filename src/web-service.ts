import express, { Application, Router } from "express";
import { BrowserLogger, ILogger } from 'swizzy-common';

export const DEFAULT_PORT_NUMBER = 3000;

export interface IRunResult {}

export interface IRunProps {
  app: Application;
}

export interface IWebService {
  readonly name: string;
  install(props: IRunProps): Promise<IRunResult>;
  uninstall(props: IRunProps): Promise<any>;
  isInstalled(): boolean;
}

export interface ServerInitializationProps {
  port?: number; // If port undefined, skip listening, assume already listening
}

export interface IWebServiceProps {
  app: Application;
  port: number;
  logger?: ILogger;
  routers?: Router[]
}

export abstract class WebService implements IWebService {
  abstract readonly name: string;
  protected _isInstalled: boolean;
  protected _logger: ILogger;
  protected routers: Router[];

  constructor(props: IWebServiceProps) {
    this._isInstalled = false;
    this._logger = props.logger??new BrowserLogger();
    this.routers = props.routers!;
  }

  install(props: IRunProps): Promise<IRunResult> {
    const { app } = props;
    const logger = this._logger;
    logger.info(`Installing web service ${this.name}`);
    if(this._isInstalled) {
      logger.error(`Service ${this.name} is already installed`);
      return Promise.reject({message: `Service ${this.name} is already installed`});
    }
    
    try {
      // install middleware
      // this.installMiddleware(app);
      logger.info(`Installing routers for ${this.name}`);
      this.installRouters(app);
      logger.info(`Installed routers for ${this.name}`);
      // install routers
      this._isInstalled = true;
      logger.info(`Installed ${this.name} successfully`);
      return Promise.resolve({message: `WebService ${this.name} installed successfully`});
    } catch (e) {
      logger.error(`Failed to install ${this.name} with error ${e}`);
      return Promise.reject({message: `WebServie ${this.name} failed to install`,exception: e});
    }
  }

  uninstall(props: IRunProps): Promise<any> {
    const { app } = props;
    const logger = this._logger;
    try {
      
      logger.info(`Uninstalling ${this.name}`);
      if(!this._isInstalled) {
        logger.error(`Unable to uninstall ${this.name} as it is not installed`);
        return Promise.reject({message: `Failed to uninstall non installed service ${this.name}`});
      }

      logger.info(`Uninstalling routters for ${this.name}`);
      this.uninstallRouters(app);
      logger.info(`Uninstalled routers for ${this.name}`);
      this._isInstalled = false;
      
      logger.info(`Uninstalled ${this.name}`);

      return Promise.resolve({message: `WebService ${this.name} uninstalled successfully`});
    } catch (e) {
        logger.error(`Failed to uninstall ${this.name} with exception ${e}`);
      return Promise.reject({message: `WebServie ${this.name} failed to uninstall`, exception: e});
    }
  }

  isInstalled(): boolean {
    return this._isInstalled;
  }

  protected installRouters(app: Application): Promise<any> {
    let logger = this._logger;
    if(this._isInstalled) {
      logger.error(`Service ${this.name} is already installed, cannot install routers`)
      return Promise.reject({message: `Service ${this.name} is already installed, cannot install routers`});
    }
    this.routers.forEach((router) => {
      app.use(router);
    });

    return Promise.resolve({message: `Routers installed for Service ${this.name}`});
  }

  protected uninstallRouters(app: Application): Promise<any> {
    const logger = this._logger;
    if(!this._isInstalled) {
      logger.error(`Service ${this.name} is not installed, cannot uninstall routers`)
      return Promise.reject({message: `Service ${this.name} is not installed, cannot uninstall routers`});
    }

    this.routers.forEach((router) => {
      // @ts-ignore
      app.unuse(router);
    });

    return Promise.resolve({message: `Uninstalled routers for Service ${this.name}`});
  }
}
