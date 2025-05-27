// @ts-ignore
import express, { Application, Router } from "@swizzyweb/express";
import { ILogger } from "@swizzyweb/swizzy-common";
import { IWebRouter, SwizzyWebRouterClass } from "../router/web-router";
import http from "http";
import https from "https";
import { IBaseUseUnuseProps } from "../common";
import { SwizzyMiddleware } from "../middleware";

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
 * Internal properties for bash WebService.
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

  middleware: SwizzyMiddleware<APP_STATE>[];

  //  server: AnyServer;
}

export interface SaveInstanceProps<INSTANCE, ROUTER> {
  instance: INSTANCE;
  router: ROUTER;
}

export interface UseUnuseProps<APP_STATE, ROUTER_STATE>
  extends IBaseUseUnuseProps<IWebRouter<APP_STATE, ROUTER_STATE>> {}

export interface UseRouterProps<APP_STATE, ROUTER_STATE>
  extends UseUnuseProps<APP_STATE, ROUTER_STATE> {}

export interface UnuseRouterProps<APP_STATE, ROUTER_STATE>
  extends UseUnuseProps<APP_STATE, ROUTER_STATE> {}

export interface UseRouterResult {
  expressRouter: Router;
}

export interface UninstallRouterProps<APP_STATE, ROUTER_STATE> {
  //UninstallRouterProps
  router: IWebRouter<APP_STATE, ROUTER_STATE>;
}
