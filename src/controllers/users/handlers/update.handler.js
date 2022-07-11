import { UserStore } from "./user.store";

export const patchById = async (req, res, next) => {
    const user = UserStore.update(req.params.id, req.body);
    res.json(user);
}