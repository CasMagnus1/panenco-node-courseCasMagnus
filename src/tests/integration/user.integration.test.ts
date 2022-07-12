import { expect } from "chai";
import request from "superagent";
import supertest from "supertest";
import { App } from "../../app";
import { User, UserStore } from "../../controllers/users/handlers/user.store";
import _ from "lodash";

const createUserFixtureWithoutId = {
    name: 'test',
    email: 'test-user+1@panenco.com',
    password: 'real secret stuff',
};
const createUserFixture = {
    name: 'test',
    email: 'test-user+1@panenco.com',
    password: 'real secret stuff',
    id: 0
};
const updateUserFixtureWithoutId = {
    name: 'test2',
    email: 'test-user+2@panenco.com',
    password: 'real secret stuff too',
};

// bootstrapping the server with supertest
describe('Integration tests', () => {
    describe('User Tests', () => {
        let request: supertest.SuperTest<supertest.Test>;
        before(() => {UserStore.users = []});
        beforeEach(() => {
            const app = new App();
            request = supertest(app.host);
        });
        let resCreate: request.Response;
        it('create user', async () => {
            resCreate = await request
                .post(`/api/users`) // post a certain route
                .send(createUserFixtureWithoutId as User) // Send a request body
                .set('x-auth', 'api-key') // Set some header
                .expect(200); // Here you can already expect a certain status code.
        });
        let resGet: request.Response;
        it('get user by id', async () => {
            resGet = await request
                .get(`/api/users/` + resCreate.body.id) // post a certain route
                .expect(200); // Here you can already expect a certain status code.
            expect(_.isEqual(resGet.body, createUserFixture)).true;
        });
        it('update user', async () => {
            const resUpdate = await request
                .patch(`/api/users/` + resGet.body.id) // post a certain route
                .send(updateUserFixtureWithoutId as User) // Send a request body
                .expect(200); // Here you can already expect a certain status code.
        });
        it('get user list', async () => {
            const resGetList = await request
                .get(`/api/users`) // post a certain route
                .expect(200); // Here you can already expect a certain status code.
            expect(resGetList.body.some((x) => (x.name === 'test2'))).true;
        });
        it('delete user', async () => {
            const resDelete = await request
                .delete(`/api/users/` + resCreate.body.id) // post a certain route
                .expect(200); // Here you can already expect a certain status code.
        });
        it('get user list again', async () => {
            const resGetList = await request
                .get(`/api/users`) // post a certain route
                .expect(200); // Here you can already expect a certain status code.
            expect(resGetList.body.some((x) => (x.name === 'test2'))).false;
        });
    });
});