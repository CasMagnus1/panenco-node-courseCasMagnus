import { expect } from "chai";
import { getList } from "../../controllers/users/handlers/getList.handler";
import { User, UserStore } from "../../controllers/users/handlers/user.store";
import { Request, Response, NextFunction } from 'express';
import { getById } from "../../controllers/users/handlers/get.handler";
import { UserView } from "../../contracts/user.view";
import { createUser } from "../../controllers/users/handlers/create.handler";
import { plainToInstance } from "class-transformer";
import { patchById } from "../../controllers/users/handlers/update.handler";
import _ from "lodash";
import { deleteById } from "../../controllers/users/handlers/delete.handler";

const userFixtures: User[] = [
    {
      name: 'test1',
      email: 'test-user+1@panenco.com',
      id: 0,
      password: 'password1',
    },
    {
      name: 'test2',
      email: 'test-user+2@panenco.com',
      id: 1,
      password: 'password2',
    },
  ];
const newUserFixture: User = {name:"Cas", password:"password", email:"cas@mail.com", id: 2};
const newUserFixtureWithoutId = {name:"Cas", password:"password", email:"cas@mail.com"};
  
  describe('Handler tests', () => {
    describe('User Tests', () => {
      beforeEach(() => {
        UserStore.users = [...userFixtures]; // Clone the array
      });
      it('should search users', async () => {
        let res: User[];
        await getList(
          { query: { search: 'test1' } as any } as Request,
          { json: (val) => (res = val) } as Response,
          null as NextFunction
        );
        expect(res.some((x) => x.name === 'test1')).true;
      });
      it('should get users', async () => {
        let res: User[];
        await getList(
          { query: { } as any } as Request,
          { json: (val) => (res = val) } as Response,
          null as NextFunction
        );
        expect(res.some((x) => x.name === 'test1') && res.some((x) => x.name === 'test2')).true;
      });
      it('should get user by id', async () => {
        let res: User;
        await getById(
          { params: {id: "0"} as any } as Request,
          { json: (val) => (res = val) } as Response,
          null as NextFunction
        );
        expect(res.name == 'test1').true;
      });
      it('should fail when getting user by unknown id', async () => {
        let res: number;
        await getById(
          { params: {id: "2"} as any } as Request,
          { status: (val) => (res = val) as any, json: (dummy) => {}} as Response,
          null as NextFunction
        );
        expect(res == 404).true;
      });
      it('should create user', async () => {
        let res: UserView;
        await createUser(
          { body: newUserFixtureWithoutId as any } as Request,
          { json: (val) => (res = val) as any} as Response,
          null as NextFunction
        );
        expect(_.isEqual(res,plainToInstance(UserView, newUserFixture))).true;
      });
      it('should update user', async () => {
        let res = {locals: {body: 'dummy'}};
        const shouldBe = newUserFixture;
        shouldBe.id = 0;
        await patchById(
          { params: {id: "0"} as any, body: newUserFixtureWithoutId as any } as Request,
            res as any,
          () => {}
        );
        expect(_.isEqual(res.locals.body, shouldBe)).true;
      });
      it('should delete user by id', async () => {
        let res;
        await deleteById(
          { params: {id: "0"} as any } as Request,
          { send: (val) => (res = val) as any} as Response,
          null as NextFunction
        );
        expect(res == "deleted").true;
        await getById(
            { params: {id: "0"} as any } as Request,
            { status: (val) => (res = val) as any, json: (dummy) => {}} as Response,
            null as NextFunction
          );
          expect(res == 404).true;
      });
    });
  });