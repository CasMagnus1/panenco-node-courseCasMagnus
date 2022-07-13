import { expect } from "chai";
import { getList } from "../../controllers/users/handlers/getList.handler";
import { getById } from "../../controllers/users/handlers/get.handler";
import { createUser } from "../../controllers/users/handlers/create.handler";
import { patchById } from "../../controllers/users/handlers/update.handler";
import _ from "lodash";
import { deleteById } from "../../controllers/users/handlers/delete.handler";
import { NotFound } from "@panenco/papi";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import ormConfig from "../../orm.config";
import { User } from "../../entities/user.entity";

const userFixtures: User[] = [
    {
      name: 'test1',
      email: 'test-user+1@panenco.com',
      password: 'password1',
    } as User,
    {
      name: 'test2',
      email: 'test-user+2@panenco.com',
      password: 'password2',
    } as User,
  ];
const newUserFixtureWithoutId = {name:"Cas", password:"password", email:"cas@mail.com"};
  
  describe('Handler tests', () => {
    describe('User Tests', () => {
      let orm;
      let users;;
      before(async () => {
        try {
          orm = await MikroORM.init(ormConfig);
        } catch (error) {
          console.log('Error while connecting to the database', error);
        }
      });
      beforeEach(async () => {
        await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
        await orm.getMigrator().up();
        const em = orm.em.fork();
        users = userFixtures.map((x) => em.create(User, x));
        await em.persistAndFlush(users);
      });
      it('should search users', () => {
        RequestContext.createAsync(orm.em.fork(), async () => {
          const users = await getList({search: 'test1'})[0];
          expect(users.some((user) => user.name === 'test1')).true;
        })
      });
      it('should get users', () => {
        RequestContext.createAsync(orm.em.fork(), async () => {
          let res: User[] = await getList({})[0];
          expect(res.some((x) => x.name === 'test1') && res.some((x) => x.name === 'test2')).true;
        });
      });
      it('should get user by id', () => {
        RequestContext.createAsync(orm.em.fork(), async () => {
          let res: User = await getById(users[0].id);
          expect(res.name == 'test1').true;
        });
      });
      it('should fail when getting user by unknown id', () => {
        RequestContext.createAsync(orm.em.fork(), async () => {
          try {
            await getById('10')
          }
          catch (error){
            expect(error.message == "id not found").true
            return;
          }
          expect(true, "non reachable").false;
        });
      });
      it('should create user', () => {
        RequestContext.createAsync(orm.em.fork(), async () => {
          let res = await createUser(newUserFixtureWithoutId);
          expect(res.name == newUserFixtureWithoutId.name).true;
        });
      });
      it('should update user', () => {
        RequestContext.createAsync(orm.em.fork(), async () => {
          patchById(users[0].id, newUserFixtureWithoutId);
          const user = await getById(users[0].id);
          expect(user.name == newUserFixtureWithoutId.name).true;
        });
      });
      it('should not update any users when wrong id', () => {
        RequestContext.createAsync(orm.em.fork(), async () => {
          let resGetOne: User[] = await getList({})[0];
          try {
            await patchById('10', newUserFixtureWithoutId)
          }
          catch (error){
            expect(error.message == "id not found").true
          }
          let resGetTwo: User[] = await getList({})[0];

          expect(resGetOne.length == resGetTwo.length).true;
          for (let i = 0; i < resGetOne.length; i++) {
              expect(_.isEqual(resGetOne[i], resGetTwo[i])).true;
          }
        });
      });
      it('should delete user by id', () => {
        RequestContext.createAsync(orm.em.fork(), async () => {
          let res = await deleteById(users[0].id);
          expect(res == "deleted").true;
          try {
            await getById(users[0].id)
          }
          catch (error){
            expect(error.message == "id not found").true
            return;
          }
          expect(true, "non reachable").false;
        });
      });
      it('should fail when delete user by wrong id', () => {
        RequestContext.createAsync(orm.em.fork(), async () => {
          let resGetOne: User[] = await getList({})[0];

          try {
            await deleteById('10')
          }
          catch (error){
            expect(error.message == "id not found").true
          }
          let resGetTwo: User[] = await getList({})[0];

          expect(resGetOne.length == resGetTwo.length).true;
        });
      });
    });
  });