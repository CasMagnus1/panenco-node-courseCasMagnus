import { expect } from "chai";
import request from "superagent";
import supertest from "supertest";
import { App } from "../../app";
import { User, UserStore } from "../../controllers/users/handlers/user.store";
import _ from "lodash";
import { StatusCode } from "@panenco/papi";

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
        before(() => {
            UserStore.users = [];
        });
        beforeEach(() => {
            const app = new App();
            request = supertest(app.host);
        });
        let token;
        let resCreate: request.Response;
        it('create user', async () => {
            resCreate = await request
                .post(`/api/users`) // post a certain route
                .send(createUserFixtureWithoutId as User) // Send a request body
                .set('x-auth', 'api-key') // Set some header
                .expect(StatusCode.created); // Here you can already expect a certain status code.

            const resLogin = await request
                .post(`/api/auth/tokens`) // post a certain route
                .send(createUserFixtureWithoutId as User) // Send a request body
                .expect(StatusCode.ok); // Here you can already expect a certain status code.
            token = resLogin.body.token;
        });
        let resGet: request.Response;
        it('get user by id', async () => {
            resGet = await request
                .get(`/api/users/` + resCreate.body.id) // post a certain route
                .set('x-auth', token) // Set some header
                .expect(StatusCode.ok); // Here you can already expect a certain status code.
            expect(resGet.body.name == createUserFixture.name);
        });
        it('update user', async () => {
            const resUpdate = await request
                .patch(`/api/users/` + resGet.body.id) // post a certain route
                .send(updateUserFixtureWithoutId as User) // Send a request body
                .set('x-auth', token) // Set some header
                .expect(StatusCode.ok); // Here you can already expect a certain status code.
        });
        it('get user list', async () => {
            const resGetList = await request
                .get(`/api/users`) // post a certain route
                .set('x-auth', token) // Set some header
                .expect(StatusCode.ok); // Here you can already expect a certain status code.
            expect(resGetList.body.items.some((x) => (x.name === 'test2'))).true;
        });
        it('delete user', async () => {
            const resDelete = await request
                .delete(`/api/users/` + resCreate.body.id) // post a certain route
                .set('x-auth', token) // Set some header
                .expect(StatusCode.noContent); // Here you can already expect a certain status code.
        });
        it('get user list again', async () => {
            const resGetList = await request
                .get(`/api/users`) // post a certain route
                .set('x-auth', token) // Set some header
                .expect(StatusCode.ok); // Here you can already expect a certain status code.
            expect(resGetList.body.items.some((x) => (x.name === 'test2'))).false;
        });
    });
});