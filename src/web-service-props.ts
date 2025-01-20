
// @ts-ignore
import express, { Application, Router } from "@swizzyweb/express";
import { ILogger } from "@swizzyweb/swizzy-common";

export interface ServerInitializationProps {
  port?: number; // If port undefined, skip listening, assume already listening
}

export interface IWebServiceProps {
  /**
   * nodejs package name as found in package.json
   */
  packageName: string;
  /**
   * Attach to existing app managed externally.
   * The web service will not start the listener or specify port for the express app
   * if this is specified. If specified you cannot specify the port parameter.
   */
  app?: Application;
  /**
   * Only specify if app is not specified, this will create a new Express app instance
   * listening on this port once installed.
   */
  port?: number;
  logger?: ILogger;
  routers?: Router[];
  appDataRoot?: string;
  serviceArgs?: any;
  state?: any;
}

