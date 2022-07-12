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
import { Authorized, Delete, Get, JsonController, Param, Patch, Post, UseBefore } from 'routing-controllers';
import { Body, getAuthenticator, ListRepresenter, Query, Representer, StatusCode } from '@panenco/papi';
import { SearchQuery } from '../../contracts/search.query';
import { OpenAPI } from 'routing-controllers-openapi';

@JsonController("/users")
export class UserController {
    @Post()
    @Representer(UserView, StatusCode.created)
    @OpenAPI({ summary: 'Create a new user' })
    async create(@Body({}, {skipMissingProperties: true}) body: UserBody) {
      return createUser(body);
    }

    @Get()
    @ListRepresenter(UserView)
    @Authorized()
    async getList(@Query() query: SearchQuery) {
      return getList(query);
    }
  
    @Get('/:id')
    @Representer(UserView)
    @Authorized()
    async get(@Param("id") id: string) {
      return getById(id);
    }
  
    @Patch('/:id')
    @Representer(UserView)
    @Authorized()
    async update(@Param("id") id: string, @Body({}, {skipMissingProperties: true}) body: UserBody) {
      return patchById(id, body);
    }
  
    @Delete('/:id')
    @Representer(null)
    @Authorized()
    async delete(@Param("id") id: string) {
      return deleteById(id);
    }
}