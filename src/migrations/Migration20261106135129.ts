import { Migration } from '@mikro-orm/migrations';

export class Migration20261106135129 extends Migration {

  override name = 'Migration20261106135129';

  override up(): void | Promise<void> {
    this.addSql(`create table "ledger_entries" ("id" uuid not null, "wallet_id" uuid not null, "transaction_id" uuid not null, "type" varchar(20) not null, "amount" numeric(20,2) not null, "currency" varchar(3) not null, "balance_after" numeric(20,2) not null, "created_at" timestamptz not null default now(), primary key ("id"));`);
    this.addSql(`create index "ledger_wallet_created_at_idx" on "ledger_entries" ("wallet_id", "created_at");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "ledger_entries" cascade;`);
  }

}
