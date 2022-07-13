import { BaseEntity, Collection, Entity, ManyToMany, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from 'uuid';
import { Address } from "./address.entity";
import { Book } from "./book.entity";

@Entity()
export class User extends BaseEntity<User, 'id'>{
    @PrimaryKey({columnType: 'uuid'})
    public id: string = v4();

    @Property()
    public name: string;

    @Property({unique: true})
    public email: string;

    @Property()
    public password: string;

    @OneToOne()
    public address: Address

    @ManyToMany(() => Book, 'authors', { owner: true })
    books = new Collection<Book>(this);
}