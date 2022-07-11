import {getList} from './handlers/getList.handler';
import { getById } from './handlers/get.handler';
import { deleteById } from './handlers/delete.handler';
import { patchById } from './handlers/update.handler';
import { createUser } from './handlers/create.handler';
import { Router, Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserBody } from '../../contracts/user.body';
import { validate } from 'class-validator';
import { UserView } from '../../contracts/user.view';

const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.get('x-auth') == "password") next();
    else res.status(401).send("not authorized");
}

const patchValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const transformed = plainToInstance(UserBody, req.body, {
      // undefined properties not taken into account
      exposeUnsetFields: false,
    });
    const validationErrors = await validate(transformed, {
      // missing properties not validated -> we wouldn't want this when creating an entity for example
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (validationErrors.length) {
      return next(validationErrors);
    }
    req.body = transformed;
    next();
  };

  const representationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const transformed = plainToInstance(UserView, res.locals.body); // Note the use of res.locals here. Locals is a way to transport data from one middleware to another.
    res.json(transformed);
  };

export class UserRoute {
    router;
    path;
    
    constructor() {
        this.router = Router();
        this.router.get('/', getList);
        this.router.get('/:id', getById);
        // this.router.patch('/:id', patchById);
        this.router.patch(
            '/:id',
            // first transform and validate
            patchValidationMiddleware,
            // handle actual logic
            patchById,
            // finally transform the output
            representationMiddleware
          );
        this.router.delete('/:id', deleteById);
        this.router.post('/', adminMiddleware, createUser);
        this.path = 'users';
      }
    
}