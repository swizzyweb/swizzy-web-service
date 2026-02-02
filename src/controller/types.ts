import { ILogger } from "@swizzyweb/swizzy-common";
import {
  SwizzyMiddleware,
  SwizzyMiddlewareFunction,
} from "../middleware/index.js";
import { StateConverter } from "../state/index.js";
import { RequestMethod } from "./request-method.js";
import { Request, Response } from "express";
/**
 * Type definition declaring controller classes have constructors.
 */
export type NewWebControllerClass<ROUTER_STATE, CONTROLLER_STATE> = new (
  props: IWebControllerProps<ROUTER_STATE, CONTROLLER_STATE>,
) => IWebController<ROUTER_STATE, CONTROLLER_STATE>;

/**
 * Boolean flag to determine if a object is a web controller. Should always be set to true.
 */
export type isWebController = { isWebController: boolean };

/**
 * Base controller class type.
 */
export type SwizzyWebControllerClass<ROUTER_STATE, CONTROLLER_STATE> =
  NewWebControllerClass<ROUTER_STATE, CONTROLLER_STATE> & isWebController;

/**
 * The function returned by a web controller.
 */
export type WebControllerFunction = (req: Request, res: Response) => void;

/**
 * Swizzy web controller interface.
 */
export interface IWebController<ROUTER_STATE, CONTROLLER_STATE> {
  name: string;
  action: string;
  method: RequestMethod;
  initialize(props: IWebControllerInitProps<ROUTER_STATE>): Promise<void>;
  controller(): WebControllerFunction; //Controller;
  installableController(): InstallableController<CONTROLLER_STATE>;
  toJson(): any;
  toString(): any;
}

/**
 * Base properties for web controller that should be extended by
 * web controller props.
 */
export interface IWebControllerProps<ROUTER_STATE, CONTROLLER_STATE> {
  logger: ILogger<any>;
  middleware?: SwizzyMiddleware<CONTROLLER_STATE>[];
}

/**
 * All properties passed to the base controller.
 */
export interface IInternalWebControllerProps<ROUTER_STATE, CONTROLLER_STATE>
  extends IWebControllerProps<ROUTER_STATE, CONTROLLER_STATE> {
  /**
   * Name of the controller.
   */
  name: string;
  /**
   * The name showed in the url.
   */
  action: string;
  /**
   * The request method, get, post, etc.
   */
  method: RequestMethod;
  /**
   * Converter that takes router state and converts to this controllers state.
   */
  stateConverter: StateConverter<ROUTER_STATE, CONTROLLER_STATE>;
}

/**
 * Protperties pass to intiailize the controller.
 */
export interface IWebControllerInitProps<ROUTER_STATE> {
  /**
   * Parent router state.
   */
  routerState: ROUTER_STATE;
}

/**
 * Interface for installing a controller onto a router.
 */
export interface InstallableController<CONTROLLER_STATE> {
  /**
   * The action used in mapping to this controller.
   */
  action: string;
  /**
   * Middleware to install and execute before this controller is invoked.
   */
  middleware: SwizzyMiddlewareFunction[];
  /**
   * The actual controller function.
   */
  controller: WebControllerFunction;
}
