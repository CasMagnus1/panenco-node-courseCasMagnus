import { expect } from "chai";
import { getList } from "../../controllers/users/handlers/getList.handler";
import { User, UserStore } from "../../controllers/users/handlers/user.store";
import { Request, Response, NextFunction } from 'express';

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

// should fail when getting user by unknown id
// should create user
// should update user
// should delete user by id
  
  describe('Handler tests', () => {
    describe('User Tests', () => {
      beforeEach(() => {
        UserStore.users = [...userFixtures]; // Clone the array
      });
      it('should search users', () => {
        let res: User[];
        getList(
          { query: { search: 'test1' } as any } as Request,
          { json: (val) => (res = val) } as Response,
          null as NextFunction
        );
        expect(res.some((x) => x.name === 'test1')).true;
      });
      it('should get users', () => {
        let res: User[];
        getList(
          { query: { } as any } as Request,
          { json: (val) => (res = val) } as Response,
          null as NextFunction
        );
        expect(res.some((x) => x.name === 'test1') && res.some((x) => x.name === 'test2')).true;
      });
      it('should get user by id', () => {
        let res: User[];
        getList(
          { params: { } as any } as Request,
          { json: (val) => (res = val) } as Response,
          null as NextFunction
        );
        expect(res.some((x) => x.name === 'test1') && res.some((x) => x.name === 'test2')).true;
      });
    });
  });