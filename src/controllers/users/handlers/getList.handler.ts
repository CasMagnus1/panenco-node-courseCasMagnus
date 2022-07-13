import { SearchQuery } from "../../../contracts/search.query";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity";


export const getList = async (query: SearchQuery): Promise<[User[], number]> => {
    const search = query.search;
    const em = RequestContext.getEntityManager();
    return await em.findAndCount(User, search ? 
        {
            $or: [{ name: { $ilike: `%${search}%` } }, { email: { $ilike: `%${search}%` } }],
          }
        : {});
}