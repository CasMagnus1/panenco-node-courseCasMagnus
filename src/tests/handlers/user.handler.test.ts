import { expect } from "chai";
import { getList } from "../../controllers/users/handlers/getList.handler";
import { User, UserStore } from "../../controllers/users/handlers/user.store";
import { getById } from "../../controllers/users/handlers/get.handler";
import { createUser } from "../../controllers/users/handlers/create.handler";
import { patchById } from "../../controllers/users/handlers/update.handler";
import _ from "lodash";
import { deleteById } from "../../controllers/users/handlers/delete.handler";
import { NotFound } from "@panenco/papi";

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
      it('should search users', () => {
        const users = getList({search: 'test1'})[0];
        expect(users.some((user) => user.name === 'test1')).true;
      });
      it('should get users', () => {
        let res: User[] = getList({})[0];
        expect(res.some((x) => x.name === 'test1') && res.some((x) => x.name === 'test2')).true;
      });
      it('should get user by id', () => {
        let res: User = getById('0');
        expect(res.name == 'test1').true;
      });
      it('should fail when getting user by unknown id', () => {
        try {
          getById('10')
        }
        catch (error){
          expect(error.message == "id not found").true
          return;
        }
        expect(true, "non reachable").false;
      });
      it('should create user', () => {
        let res = createUser(newUserFixtureWithoutId);
        expect(res.name == newUserFixtureWithoutId.name).true;
      });
      it('should update user', () => {
        patchById('0', newUserFixtureWithoutId);
        const user = getById('0');
        expect(user.name == newUserFixtureWithoutId.name).true;
      });
      it('should not update any users when wrong id', () => {
        let resGetOne: User[] = getList({})[0];
        try {
          patchById('10', newUserFixtureWithoutId)
        }
        catch (error){
          expect(error.message == "id not found").true
        }
        let resGetTwo: User[] = getList({})[0];

        expect(resGetOne.length == resGetTwo.length).true;
        for (let i = 0; i < resGetOne.length; i++) {
            expect(_.isEqual(resGetOne[i], resGetTwo[i])).true;
        }
      });
      it('should delete user by id', () => {
        let res = deleteById('0');
        expect(res == "deleted").true;
        try {
          getById('0')
        }
        catch (error){
          expect(error.message == "id not found").true
          return;
        }
        expect(true, "non reachable").false;
      });
      it('should fail when delete user by wrong id', () => {
        let resGetOne: User[] = getList({})[0];

        try {
          deleteById('10')
        }
        catch (error){
          expect(error.message == "id not found").true
        }
        let resGetTwo: User[] = getList({})[0];

        expect(resGetOne.length == resGetTwo.length).true;
      });
    });
  });