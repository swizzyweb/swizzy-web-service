import { BrowserLogger, ILogger } from "@swizzyweb/swizzy-common";
import { isPortInUse } from "./util/port-checker";
// @ts-ignore
import express, { Application, Router, Request, Response } from "@swizzyweb/express";
import { getAppDataPathFromProps,  getAppDataPathFromPropsAndInitialize } from './util/app-data-helper';
import { IWebServiceProps } from './web-service-props';

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
    /*if (props.app && props.port) {
		throw new Error(`You can only provide 1 of port or a externally managed app parameter`);
	}

	if (!props.app && !props.port) {
		throw new Error(`You must specify 1 of app or port`);
	}*/

    this._isInstalled = false;
    this._logger = props.logger ?? new BrowserLogger();
    this.routers = props.routers!;
    this.app = props.app;
    this.port = props.port;
    this.packageName = props.packageName;
    this.appDataPath = getAppDataPathFromPropsAndInitialize(props);

    //this.app[props.packageName] = {
     // state: {}
    //}
  }

  async install(props: IRunProps): Promise<IRunResult> {
    //const { app } = props;

    //const app = this.app;
    const logger = this._logger;
    logger.info(`Installing web service ${this.name}`);
    if (this._isInstalled) {
      logger.error(`Service ${this.name} is already installed`);
      return Promise.reject({
        message: `Service ${this.name} is already installed`,
      });
    }

    /*if (!this.app) {
		if (!this.port) {
			throw new Error(`Port or app must exist`); // This should never happen
		}
		
		logger.info(`Initializing app for ${this.name}`);
		this.app = express();
		logger.info(`Initialized app for ${this.name}`);

	}
 		logger.debug(`app: ${this.app}`);   */
    try {
      // install middleware
      // this.installMiddleware(app);
      logger.info(`Installing routers for ${this.name}`);
      this.installRouters();
      logger.info(`Installed routers for ${this.name}`);
      // install routers

      /*if (this.port) {
		const portInUse = await isPortInUse(this.port, 'localhost');
		if (portInUse) {
			throw new Error(`Port ${this.port} is already in use`);
		}

	  	this.server = this.app.listen(this.port, () => {
			logger.info(`${this.name} running on port ${this.port}`);
		})
	  }*/

      this._isInstalled = true;
      logger.info(`Installed ${this.name} successfully`);

      return Promise.resolve({
        message: `WebService ${this.name} installed successfully`,
      });
    } catch (e) {
      logger.error(`Failed to install ${this.name} with error ${e}`);
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
      /*
	  if (this.server) {
	  	logger.info(`Stopping server for ${this.name}`);
		this.server.close(() => {
			logger.info(`Closed server for ${this.name}`);
			logger.info(`Deleting server for ${this.name}`)
		delete this.server;
		logger.info(`Deleted server for ${this.name}`);

		});
	  } else {
		logger.info(`App managed externally, skipping stopping server for ${this.name}`);
	  }
	  */
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
    this.routers.forEach((router) => {
       this.addMiddleware(router); 
logger.info("Installing router using use");
      this.app.use(router);
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
    return {};
  }



    /**
*     Does nothing by default
* */
    protected addMiddleware(router: Router): void {
      
    }
}
/*
function _getCallerFile() {
    var filename;

    var _pst = Error.prepareStackTrace
    Error.prepareStackTrace = function (err, stack) { return stack; };
    try {
        var err = new Error();
        var callerfile;
        var currentfile;

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) {
                filename = callerfile;
                break;
            }
        }
    } catch (err) {}
    Error.prepareStackTrace = _pst;

    return filename;
}
*/
