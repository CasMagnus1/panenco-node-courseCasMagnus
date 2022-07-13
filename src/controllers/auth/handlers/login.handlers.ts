import { RequestContext } from "@mikro-orm/core";
import { createAccessToken, Unauthorized } from "@panenco/papi";
import { LoginBody } from "../../../contracts/auth.body";
import { User } from "../../../entities/user.entity";

export const login = async (body: LoginBody) => {
    const em = RequestContext.getEntityManager();
    const user = await em.findOneOrFail(User, { email: body.email });
    if (user.password != body.password) throw new Unauthorized("wrong credentials", "wrong credentials");
    else {
        return await createAccessToken("secret", 60 * 10, {id: user.id});
    }
}