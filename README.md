# SwizzyWebService

Swizzy web service is a library for creating self contained web services. The library is object oriented and provides base implementations for all of the components necessary to get a web service up and running.

# Getting Started

## Install via npm

```
npm install --registry=https://npm.swizzyweb.com @swizzyweb/swizzy-web-service
```

# Creating your first web service

## Create web service

```
// ./web-service.ts
// WebServiceStatae containing properties used by web service, routers, or controllers
export interface SampleBackendWebServiceState {
  yourStatePropery: "my variable (can be any data type)"
...
}

// Constructor properties, can extend base interface to get base properties
export interface SampleBackendWebServiceProps
  extends IWebServiceProps<SampleBackendWebServiceState> {
  port: number;
  path?: string;
}

// Web service implementation, basically just need to inject properties
export class SampleBackendWebService extends WebService<SampleBackendWebServiceState> {
  constructor(props: SampleBackendWebServiceProps) {
    super({
      ...props,
      name: "SampleBackendWebService",
      path: props.path??'yourRootPath',
      packageName: "your-package-name",
      routerClasses: [
        YourRouter,
        ...
      ],
      middleware: [],
    });
  }
}
```

## Create router

```
// ./routers/StatisticsRouter/statistics-router.ts

// Router state
export interface StatisticsRouterState {
  serverStartTime: number;
}
// Router state with properties used by router and controllers
export interface StatisticsRouterProps
  extends IWebRouterProps<
    SampleBackendWebServiceState,
    StatisticsRouterState
  > {}

// WebRouter implementation, wires up controllers, middleware, and state converter
export class StatisticsWebRouter extends WebRouter<
  SampleBackendWebServiceState,
  StatisticsRouterState
> {
  constructor(props: StatisticsRouterProps) {
    super({
      ...props,
      name: "StatisticsWebRouter",
      path: "stats",
      stateConverter: StatisticsRouterStateConverter,
      webControllerClasses: [UpTimeController],
      middleware: [
        SwizzyRequestMiddleware,
        RequestIdMiddleware,
        RequestLoggerMiddleware,
      ],
    });
  }
}

// State converter converting state from web service to router state.
const StatisticsRouterStateConverter: StateConverter<
  SampleBackendWebServiceState,
  StatisticsRouterState
> = async function (
  props: StateConverterProps<SampleBackendWebServiceState>,
): Promise<StatisticsRouterState> {
  return { ...props.state };
};
```

## Create Controller

```
// ./routers/StatisticsRouter/controllers/uptime-controller.ts
// Controller state
export interface UpTimeControllerState {
  serverStartTime: number;
}

// Controller constructor properties
export interface UpTimeControllerProps
  extends IWebControllerProps<StatisticsRouterState, UpTimeControllerState> {}

// Controller implementation
export class UpTimeController extends WebController<
  StatisticsRouterState,
  UpTimeControllerState
> {
  constructor(props: UpTimeControllerProps) {
    super({
      ...props,
      name: "UpTimeController" /**Name of controller**/,
      action: "uptime" /**last component of url**/,
      method: RequestMethod.get /**Request method**/,
      /**State converter taking in router state and convert to this state**/
      stateConverter: DefaultStateExporter,
      middleware: [/**Any middleware to use**/],
    });
  }

  // This is where the main controller logic is handled.
  protected async getInitializedController(
/** This will be removed, use getState() instead **/
    props: IWebControllerInitProps<StatisticsRouterState> & {
      state: UpTimeControllerState | undefined;
    },
  ): Promise<WebControllerFunction> {
    const logger = this.logger;
    // Adding the bind here is required to use the state in the controller function.
    const getState = this.getState.bind(this);
    return async function (req: Request, res: Response) {
      try {
        const { serverStartTime } = getState()!;
        const now = Date.now();
        const upTime = now - serverStartTime;
        res.json({
          now,
          upSince: {
            epoch: serverStartTime,
            date: new Date(serverStartTime),
          },
          upTime,
        });
      } catch (e: any) {
        res.status(500);
        res.json({ message: "Internal error occurred" });
      }
    };
  }
}
```

## Wire up stack and expose

```
./app.ts
// getWebservice props
export interface GetSampleFrontendWebserviceProps {
  serviceArgs: {
    /** web service specific arguments **/
    ...
  };
}
export async function getWebservice(
  props: GetSampleFrontendWebserviceProps & any,
) {
  const state = {
    serverStartTime: Date.now(),
  };
  return new SampleBackendWebService({
    ...props,
    ...props.serviceArgs,
    state,
  });
}
```

## Add entrypoint to package.json

```
// package.json
{
  ...,
  "main": "dist/app.js"
  ...
}
```

## Run

```
npm install
npm run build
swerve
```

# Docs

https://swizzyweb.github.io/swizzy-web-service/

# Sample apps

## Frontend template

https://github.com/swizzyweb/swizzy-frontend-template-web-service

## Backend template

https://github.com/swizzyweb/swizzy-backend-template-web-service

# Architecture

The architecture of a swizzy web service is made up of 3 layers, the WebService, Router, and Controller.

## WebService

The web service layer is the top layer of a SwizzyWebService and contains all other layers. It contains all other layers as well as the base path of the web service. The base implementation this class orchestrates the initialization of the web service when installed with swerve.

## WebRouter

Web routers act as a collection of controllers that are the endpoints of the web service api. The Web router has a path that is appended to the web service path, and routes to child controllers. The controllers of a web router are injected in the base constructor of the WebRouter class.

## WebController

Web controllers are the handler for user requests.

## #Middleware

Middleware can be injected into any of the layers to peform request pre-processing. Common use cases are validation, authorization, logging, request parsing, and others.

## State

State can be injected into a SwizzyWebService to share context between routers and controllers. This is a good place to inject database clients, service clients, or any dependency that you'll need in your controllers.

### State Converter

State converters are used to transform state between each of the layers. WebRouters and WebControllers each have a state converter that takes in the parent state and transforms it to the current layers state. IE: WebServiceState -> WebRouterState, WebRouterState -> WebControllerState.

# Notes

Tests now require node 24 as of v0.5.0

## Breaking changes

v0.6.0

- Upgrade express dependency to use the main 5.2.1 which removes the unuse method. Instead of using '@swizzyweb/express', just use 'express' in your swizzy web services.
- Swerve will also need to be updated to a later version supporting using the default express package.
