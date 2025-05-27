import { ILogger } from "@swizzyweb/swizzy-common";
import { SwizzyMiddleware, SwizzyMiddlewareFunction } from "../middleware";
import { StateConverter } from "../state/state-converter";
import {
  IInternalWebControllerProps,
  InstallableController,
  IWebController,
  IWebControllerInitProps,
  WebControllerFunction,
} from "./types";
import { RequestMethod } from "./request-method";

/**
 * Base web controller class to be used by routers.
 */
export abstract class WebController<ROUTER_STATE, CONTROLLER_STATE>
  implements IWebController<ROUTER_STATE, CONTROLLER_STATE>
{
  static readonly isWebController = true;
  public name: string;
  /**
   * Configured in initialize.
   */
  actualController?: WebControllerFunction;
  state?: CONTROLLER_STATE;
  protected logger: ILogger<any>;
  protected stateConverter: StateConverter<ROUTER_STATE, CONTROLLER_STATE>;
  public readonly action: string;
  public readonly method: RequestMethod;
  private middleware: SwizzyMiddleware<CONTROLLER_STATE>[];
  constructor(
    props: IInternalWebControllerProps<ROUTER_STATE, CONTROLLER_STATE>,
  ) {
    this.name = props.name;
    this.logger = props.logger.clone({ owner: this.name });
    this.middleware = props.middleware ?? [];
    this.action = props.action;
    this.method = props.method;
    this.stateConverter = props.stateConverter;
  }

  /**
   * Initialize controller.
   * Must be called before calling controller()
   */
  async initialize(
    props: IWebControllerInitProps<ROUTER_STATE>,
  ): Promise<void> {
    this.logger.debug(`Initializing controller ${this.name}`);
    this.state = await this.stateConverter({ state: props.routerState });
    try {
      this.actualController = await this.getInitializedController({
        ...props,
        state: this.getState(),
      });
    } catch (e: any) {
      this.logger.error(`Error initializing controller with error: ${e}`);
      throw {
        message: "Error initializing controller",
        stack: e.stack ?? new Error("Error initializing controller").stack,
        error: e,
      };
    }
    this.logger.debug(`Initialized controller ${this.name}`);
  }

  /**
   * overide this to configure your router, ensuring you call super first.
   */
  protected abstract getInitializedController(
    props: IWebControllerInitProps<ROUTER_STATE> & {
      state: CONTROLLER_STATE | undefined;
    },
  ): Promise<WebControllerFunction>;

  controller(): WebControllerFunction {
    if (this.actualController) {
      return this.actualController;
    } else {
      throw {
        name: "ControllerNotInitializedError",
        message: `Controller is not defined, did you call initialize on this router?`,
        stack: new Error("ControllerNotInitializedError").stack,
      };
    }
  }

  public installableController(): InstallableController<CONTROLLER_STATE> {
    return {
      action: `${this.action}`,
      middleware: this.getMiddleware(),
      controller: this.controller(),
    };
  }

  protected getState(): CONTROLLER_STATE | undefined {
    return this.state;
  }

  public getMiddleware(): SwizzyMiddlewareFunction[] {
    const state = this.getState()!;
    const logger = this.logger;
    const mappedMiddleware = [];
    for (const middle of this.middleware) {
      mappedMiddleware.push(middle({ logger, state }));
    }
    return mappedMiddleware;
  }
}
