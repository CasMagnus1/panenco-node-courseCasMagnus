import { BaseEntity, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from 'uuid';

@Entity()
export class Address extends BaseEntity<Address, 'id'>{
    @PrimaryKey({columnType: 'uuid'})
    public id: string = v4();

    @Property()
    public street: string;
}