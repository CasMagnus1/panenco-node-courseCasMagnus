import { UserBody } from "../../../contracts/user.body";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity"
import { Address } from "../../../entities/address.entity";
import { Book } from "../../../entities/book.entity";

export const createUser = async (body: UserBody) => {
    const em = RequestContext.getEntityManager();
    const addr = new Address();
    addr.street = "testStreet";
    const book = new Book();
    book.title = "testTitle";
    const user = em.create(User, {...body, address: addr, books: [book]});
    await em.persistAndFlush(user);
    return user;
}