import { ILogger } from "@swizzyweb/swizzy-common";
import { SwizzyMiddleware, SwizzyMiddlewareFunction } from "../middleware";
import { StateConverter } from "../state";
import { RequestMethod } from "./request-method";

export type NewWebControllerClass<ROUTER_STATE, CONTROLLER_STATE> = new (
  props: IWebControllerProps<ROUTER_STATE, CONTROLLER_STATE>,
) => IWebController<ROUTER_STATE, CONTROLLER_STATE>;

export type isWebController = { isWebController: boolean };
export type SwizzyWebControllerClass<ROUTER_STATE, CONTROLLER_STATE> =
  NewWebControllerClass<ROUTER_STATE, CONTROLLER_STATE> & isWebController;

export type WebControllerFunction = (req: Request, res: Response) => void;

export interface IWebController<ROUTER_STATE, CONTROLLER_STATE> {
  name: string;
  action: string;
  method: RequestMethod;
  initialize(props: IWebControllerInitProps<ROUTER_STATE>): Promise<void>;
  controller(): WebControllerFunction; //Controller;
  installableController(): InstallableController<CONTROLLER_STATE>;
}

export interface IWebControllerProps<ROUTER_STATE, CONTROLLER_STATE> {
  logger: ILogger<any>;
  middleware?: SwizzyMiddleware<CONTROLLER_STATE>[];
}

export interface IInternalWebControllerProps<ROUTER_STATE, CONTROLLER_STATE>
  extends IWebControllerProps<ROUTER_STATE, CONTROLLER_STATE> {
  name: string;
  action: string;
  method: RequestMethod;
  stateConverter: StateConverter<ROUTER_STATE, CONTROLLER_STATE>;
}

export interface IWebControllerInitProps<ROUTER_STATE> {
  routerState: ROUTER_STATE;
}

export interface InstallableController<CONTROLLER_STATE> {
  action: string;
  middleware: SwizzyMiddlewareFunction[];
  controller: WebControllerFunction;
}
