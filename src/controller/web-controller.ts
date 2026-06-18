import { ILogger } from "@swizzyweb/swizzy-common";
import {
  SwizzyMiddleware,
  SwizzyMiddlewareFunction,
} from "../middleware/index.js";
import { StateConverter } from "../state/state-converter.js";
import {
  IInternalWebControllerProps,
  InstallableController,
  IWebController,
  IWebControllerInitProps,
  WebControllerFunction,
} from "./types.js";
import { RequestMethod } from "./request-method.js";
import { middlewaresToJson, stateConverterToJson } from "../util/index.js";
import { trimSlashes } from "../util/trim-slashes.js";

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
  /**
   * Logger
   */
  protected logger: ILogger<any>;
  /**
   * Converts router state to this controller state.
   */
  protected stateConverter: StateConverter<ROUTER_STATE, CONTROLLER_STATE>;
  /**
   * Url Action, ie: /service/router/controller <-- this.
   */
  public readonly action: string;
  /**
   * Htto method.
   */
  public readonly method: RequestMethod;
  /**
   * Swizzy middleware to execute before the controller function invocation.
   */
  private middleware: SwizzyMiddleware<CONTROLLER_STATE>[];
  /**
   * Constructor with internal props.
   */
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

  /**
   * Returns the initialized controller function.
   * @throws if `initialize` has not been called yet
   */
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

  /**
   * Returns an `InstallableController` descriptor used by the router to mount
   * this controller onto an Express router.
   */
  public installableController(): InstallableController<CONTROLLER_STATE> {
    return {
      action: `${this.action}`,
      middleware: this.getMiddleware(),
      controller: this.controller(),
    };
  }

  /**
   * Returns the current controller-level state, or `undefined` if not yet initialized.
   */
  protected getState(): CONTROLLER_STATE | undefined {
    return this.state;
  }

  /**
   * Returns the resolved middleware functions to be applied before this controller.
   * Each `SwizzyMiddleware` factory is invoked with the current state and logger.
   * @returns array of Express middleware functions
   */
  public getMiddleware(): SwizzyMiddlewareFunction[] {
    const state = this.getState()!;
    const logger = this.logger;
    const mappedMiddleware = [];
    for (const middle of this.middleware) {
      mappedMiddleware.push(middle({ logger, state }));
    }
    return mappedMiddleware;
  }

  /**
   * Serializes the controller to a plain JSON-compatible object.
   * Logger is omitted for safety.
   * @returns JSON representation of this controller
   */
  toJson() {
    const middleware = middlewaresToJson(this.middleware);

    const { name, logger, action, method } = this;
    return {
      name,
      logger: undefined,
      action,
      method,
      middleware,
      stateConverter: stateConverterToJson(this.stateConverter),
    };
  }

  /**
   * Returns a JSON string representation of this controller.
   * @returns stringified JSON of the controller
   */
  toString(): string {
    return JSON.stringify(this.toJson());
  }
}
