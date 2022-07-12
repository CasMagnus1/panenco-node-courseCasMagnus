import { UserStore } from "./user.store";
import { NextFunction, Request, Response } from "express";
import { NotFound } from "@panenco/papi";

export const getById = (id: string) => {
    const user = UserStore.get(parseInt(id));
    if (!user) {
        throw new NotFound("id not found", "id not found");
    }
    else return user;
}