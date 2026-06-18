import { Application, Router } from "express";
import { ILogger } from "@swizzyweb/swizzy-common";
import { IWebRouter, SwizzyWebRouterClass } from "../router/web-router.js";
import { IBaseUseUnuseProps } from "../common/index.js";
import { SwizzyMiddleware } from "../middleware/index.js";

/**
 * Required fields for client facing WebServices.
 * This is intented to be the base class for extensions
 * of the abstract WebService base class.
 */
export interface IWebServiceProps<APP_STATE> {
  /**
   * Attach to existing app managed externally.
   * The web service will not start the listener or specify port for the express app
   * if this is specified. If specified you cannot specify the port parameter.
   */
  app: Application;

  /**
   * Logger.
   */
  logger: ILogger<any>;

  /**
   * State for sharing for app.
   */
  state: APP_STATE;

  /**
   * Port app is listening on.
   */
  port: number;
}

/**
 * Internal properties for the base WebService class.
 */
export interface IInternalWebServiceProps<APP_STATE>
  extends IWebServiceProps<APP_STATE> {
  /**
   * Name of WebService.
   */
  name: string;

  /**
   * Classes of routers to attach.
   */
  routerClasses: SwizzyWebRouterClass<APP_STATE, any>[];

  /**
   * Path of app.
   */
  path: string;

  /**
   * nodejs package name as found in package.json
   */
  packageName: string;

  /** Middleware to apply to every router mounted by this service. */
  middleware: SwizzyMiddleware<APP_STATE>[];

  //  server: AnyServer;
}

/** Props for persisting a router instance inside the web service. */
export interface SaveInstanceProps<INSTANCE, ROUTER> {
  /** The web router instance. */
  instance: INSTANCE;
  /** The underlying Express router. */
  router: ROUTER;
}

/** Base props shared by use/unuse router operations. */
export interface UseUnuseProps<APP_STATE, ROUTER_STATE>
  extends IBaseUseUnuseProps<IWebRouter<APP_STATE, ROUTER_STATE>> {}

/** Props for mounting a router onto the Express app. */
export interface UseRouterProps<APP_STATE, ROUTER_STATE>
  extends UseUnuseProps<APP_STATE, ROUTER_STATE> {}

/** Props for unmounting a router from the Express app. */
export interface UnuseRouterProps<APP_STATE, ROUTER_STATE>
  extends UseUnuseProps<APP_STATE, ROUTER_STATE> {}

/** Result returned after a router is mounted. */
export interface UseRouterResult {
  /** The underlying Express router that was mounted. */
  expressRouter: Router;
}

/** Props for uninstalling a router from the web service. */
export interface UninstallWebServiceRouterProps<APP_STATE, ROUTER_STATE> {
  /** The web router to uninstall. */
  router: IWebRouter<APP_STATE, ROUTER_STATE>;
}
