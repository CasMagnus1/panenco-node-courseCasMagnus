import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { User, UserStore } from "./user.store";
import { UserBody } from "../../../contracts/user.body";
import { validate } from "class-validator";
import { UserView } from "../../../contracts/user.view";

export const createUser = (body: UserBody) => {
    const user = UserStore.add(body);
    return user;
}