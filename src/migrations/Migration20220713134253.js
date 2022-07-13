'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220713134253 extends Migration {

  async up() {
    this.addSql('create table "book" ("id" uuid not null, "title" varchar(255) not null, "author_id" uuid not null);');
    this.addSql('alter table "book" add constraint "book_pkey" primary key ("id");');

    this.addSql('alter table "book" add constraint "book_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
  }

  async down() {
    this.addSql('drop table if exists "book" cascade;');
  }

}
exports.Migration20220713134253 = Migration20220713134253;
