import { createAccessToken, Unauthorized } from "@panenco/papi";
import { LoginBody } from "../../../contracts/auth.body";
import { UserStore } from "../../users/handlers/user.store";

export const login = async (body: LoginBody) => {
    const user = UserStore.getByEmail(body.email);
    if (!user || user.password != body.password) throw new Unauthorized("wrong credentials", "wrong credentials");
    return await createAccessToken("secret", 60 * 10, {id: user.id})
    // const user = UserStore.add(body);
    // return user;
}