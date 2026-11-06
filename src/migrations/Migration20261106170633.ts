import { Migration } from '@mikro-orm/migrations';

export class Migration20261106170633 extends Migration {

  override name = 'Migration20261106170633';

  override up(): void | Promise<void> {
    this.addSql(`create table "idempotency_records" ("id" uuid not null, "key" varchar(255) not null, "request_hash" varchar(64) not null, "response" jsonb null, "created_at" timestamptz not null default now(), primary key ("id"));`);
    this.addSql(`alter table "idempotency_records" add constraint "idempotency_key_unique" unique ("key");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "idempotency_records" cascade;`);
  }

}
