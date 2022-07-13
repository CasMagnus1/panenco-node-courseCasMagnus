'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220713140439 extends Migration {

  async up() {
    this.addSql('create table "user_books" ("user_id" uuid not null, "book_id" uuid not null);');
    this.addSql('alter table "user_books" add constraint "user_books_pkey" primary key ("user_id", "book_id");');

    this.addSql('alter table "user_books" add constraint "user_books_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_books" add constraint "user_books_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "book" drop constraint "book_author_id_foreign";');

    this.addSql('alter table "book" drop column "author_id";');
  }

  async down() {
    this.addSql('drop table if exists "user_books" cascade;');

    this.addSql('alter table "book" add column "author_id" uuid not null;');
    this.addSql('alter table "book" add constraint "book_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
  }

}
exports.Migration20220713140439 = Migration20220713140439;
