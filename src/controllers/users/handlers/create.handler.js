import { UserStore } from "./user.store";

export const createUser = async (req, res, next) => {
    if (req.body.name == null) {
        return next({"details":"no user name provided"});
    }
    const user = UserStore.add(req.body);
    res.json(user);
}