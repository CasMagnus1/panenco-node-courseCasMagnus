import { BaseEntity, Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from 'uuid';
import { User } from "./user.entity";

@Entity()
export class Book extends BaseEntity<Book, 'id'>{
    @PrimaryKey({columnType: 'uuid'})
    public id: string = v4();

    @Property()
    public title: string;

    @ManyToMany(() => User, user => user.books)
    authors = new Collection<Book>(this);
}