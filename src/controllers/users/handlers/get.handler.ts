import { UserStore } from "./user.store";

export const getById = async (req, res, next) => {
    const user = UserStore.find(req.params.id);
    if (user.length == 0) {
        res.status(404);
        res.json({'details': 'user not found'});
    }
    else res.json(user);
}