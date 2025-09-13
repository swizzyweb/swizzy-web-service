# SwizzyWebService

Swizzy web service is a library for creating self contained web services. The library is object oriented and provides base implementations for all of the components necessary to get a web service up and running.

## Getting Started

### Install via npm

```
npm install --registry=https://npm.swizzyweb.com @swizzyweb/swizzy-web-service
```

### Sample apps

#### Frontend template

https://github.com/swizzyweb/swizzy-frontend-template-web-service

#### Backend template

https://github.com/swizzyweb/swizzy-backend-template-web-service

## Architecture

The architecture of a swizzy web service is made up of 3 layers, the WebService, Router, and Controller.

### WebService

The web service layer is the top layer of a SwizzyWebService and contains all other layers. It contains all other layers as well as the base path of the web service. The base implementation this class orchestrates the initialization of the web service when installed with swerve.

### WebRouter

Web routers act as a collection of controllers that are the endpoints of the web service api. The Web router has a path that is appended to the web service path, and routes to child controllers. The controllers of a web router are injected in the base constructor of the WebRouter class.

### WebController

Web controllers are the handler for user requests.

### #Middleware

Middleware can be injected into any of the layers to peform request pre-processing. Common use cases are validation, authorization, logging, request parsing, and others.

### State

State can be injected into a SwizzyWebService to share context between routers and controllers. This is a good place to inject database clients, service clients, or any dependency that you'll need in your controllers.

#### State Converter

State converters are used to transform state between each of the layers. WebRouters and WebControllers each have a state converter that takes in the parent state and transforms it to the current layers state. IE: WebServiceState -> WebRouterState, WebRouterState -> WebControllerState.

## Note

Tests now require node 24 as of v0.5.0
