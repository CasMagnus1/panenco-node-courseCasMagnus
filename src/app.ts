// src/app.js
import 'express-async-errors';
import express from 'express';
import { UserController } from './controllers/users/user.controller';
import {Request, Response, NextFunction, Application} from 'express';
import { getMetadataArgsStorage, RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import { errorMiddleware, getAuthenticator } from '@panenco/papi';
import { AuthController } from './controllers/auth/auth.controller';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import ormConfig from './orm.config';

export class App {
  public orm: MikroORM<PostgreSqlDriver>;
  public async createConnection() {
    try {
      this.orm = await MikroORM.init(ormConfig);
    } catch (error) {
      console.log('Error while connecting to the database', error);
    }
  }

  host: Application;

  constructor() {
    // Init server
    this.host = express();
    this.host.use((req, __, next: NextFunction) => {
      RequestContext.create(this.orm.em, next);
    });
    this.host.use(express.json());
    this.host.use((req, res, next) => {
        console.log(req.method, req.url);
        next();
    })
    // const userRouter = new UserRoute();
    // this.host.use(`/api/${userRouter.path}`, userRouter.router);
    this.initializeControllers([UserController, AuthController]);
    this.initializeSwagger();
    this.host.use(errorMiddleware);
  }

  private initializeControllers(controllers: Function[]) {
    useExpressServer(this.host, { // Link the express host to routing-controllers
      cors: {
        origin: "*", // Allow all origins, any application on any url can call our api. This is why we also added the `cors` package.
        exposedHeaders: ["x-auth"], // Allow the header `x-auth` to be exposed to the client. This is needed for the authentication to work later.
      },
      controllers, // Provide the controllers. Currently this won't work yet, first we need to convert the Route to a routing-controllers controller.
      defaultErrorHandler: false, // Disable the default error handler. We will handle errors through papi later.
      routePrefix: "/api", // Map all routes to the `/api` path.
      authorizationChecker: getAuthenticator('secret') // Tell routing-controllers to use the papi authentication checker
    });
 }


 private initializeSwagger() {
  const { defaultMetadataStorage } = require('class-transformer/cjs/storage');
  const swaggerUi = require('swagger-ui-express');


  const schemas = validationMetadatasToSchemas({
    classTransformerMetadataStorage: defaultMetadataStorage,
    refPointerPrefix: '#/components/schemas/',
  }); // convert the metadata to an OpenAPI json schema

  const routingControllersOptions: RoutingControllersOptions = {
    routePrefix: '/api', // Set the route prefix so swagger knows all endpoints are prefixed with /api
  }; // configure some general options

  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, routingControllersOptions, { // Convert the routing controller metadata + the class-validator metadata into an OpenAPI spec
    components: {
      schemas,
      securitySchemes: { // Add a security scheme so we will be able to enter a token on the endpoints
        JWT: {
          in: 'header',
          name: 'x-auth', // Define the header key to use
          type: 'apiKey',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the JWT scheme. Example: "x-auth: {token}"',
        },
      },
    },
    security: [{ JWT: [] }],
  });
  this.host.use('/docs', swaggerUi.serve, swaggerUi.setup(spec)); // Host swagger ui on /docs
}

  listen() {
    this.host.listen(3000, () => {
      console.info(`🚀 http://localhost:3000`);
      console.info(`========================`);
    });
  }
}