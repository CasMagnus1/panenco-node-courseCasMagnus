import { User, UserStore } from "./user.store";
import { NextFunction, Request, Response } from "express";
import { SearchQuery } from "../../../contracts/search.query";


export const getList = (query: SearchQuery): [User[], number] => {
    const users = UserStore.find(query.search);
    return [users, users.length];
}