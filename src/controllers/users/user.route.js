import {getList} from './handlers/getList.handler';
import { getById } from './handlers/get.handler';
import { deleteById } from './handlers/delete.handler';
import { patchById } from './handlers/update.handler';
import { createUser } from './handlers/create.handler';
import { Router } from 'express';

const adminMiddleware = (req, res, next) => {
    if (req.get('x-auth') == "password") next();
    else res.status(401).send("not authorized");
}

export class UserRoute {
    constructor() {
        this.router = Router();
        this.router.get('/', getList);
        this.router.get('/:id', getById);
        this.router.patch('/:id', patchById);
        this.router.delete('/:id', deleteById);
        this.router.post('/', adminMiddleware, createUser);
        this.path = 'users';
      }
}