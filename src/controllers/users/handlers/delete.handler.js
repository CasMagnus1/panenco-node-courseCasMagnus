import { UserStore } from "./user.store";

export const deleteById = async (req, res, next) => {
    UserStore.delete(req.params.id);
    res.send("deleted");
}