'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220713124335 extends Migration {

  async up() {
    this.addSql('create table "address" ("id" uuid not null, "street" varchar(255) not null);');
    this.addSql('alter table "address" add constraint "address_pkey" primary key ("id");');

    this.addSql('alter table "user" add column "address_id" uuid not null;');
    this.addSql('alter table "user" add constraint "user_address_id_foreign" foreign key ("address_id") references "address" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_address_id_unique" unique ("address_id");');
  }

  async down() {
    this.addSql('alter table "user" drop constraint "user_address_id_foreign";');

    this.addSql('drop table if exists "address" cascade;');

    this.addSql('alter table "user" drop constraint "user_address_id_unique";');
    this.addSql('alter table "user" drop column "address_id";');
  }

}
exports.Migration20220713124335 = Migration20220713124335;
