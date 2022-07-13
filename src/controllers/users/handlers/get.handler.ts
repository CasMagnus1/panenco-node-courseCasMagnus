import { NotFound } from "@panenco/papi";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity";

export const getById = async (id: string) => {
    const em = RequestContext.getEntityManager();
    const user = await em.findOneOrFail(User, {id});
    return user;
}