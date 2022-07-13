'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220713125411 extends Migration {

  async up() {
    this.addSql('alter table "user" drop constraint "user_address_id_foreign";');

    this.addSql('alter table "user" alter column "address_id" drop default;');
    this.addSql('alter table "user" alter column "address_id" type uuid using ("address_id"::text::uuid);');
    this.addSql('alter table "user" alter column "address_id" set not null;');
    this.addSql('alter table "user" add constraint "user_address_id_foreign" foreign key ("address_id") references "address" ("id") on update cascade;');
  }

  async down() {
    this.addSql('alter table "user" drop constraint "user_address_id_foreign";');

    this.addSql('alter table "user" alter column "address_id" drop default;');
    this.addSql('alter table "user" alter column "address_id" type uuid using ("address_id"::text::uuid);');
    this.addSql('alter table "user" alter column "address_id" drop not null;');
    this.addSql('alter table "user" add constraint "user_address_id_foreign" foreign key ("address_id") references "address" ("id") on update cascade on delete set null;');
  }

}
exports.Migration20220713125411 = Migration20220713125411;
