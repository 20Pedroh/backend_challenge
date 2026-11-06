import { Migration } from '@mikro-orm/migrations';

export class Migration20261106184312 extends Migration {

  override name = 'Migration20261106184312';

  override up(): void | Promise<void> {
    this.addSql(`create table "financial_transactions" ("id" uuid not null, "external_id" varchar(255) not null, "wallet_id" uuid not null, "type" varchar(20) not null, "status" varchar(30) not null, "amount" numeric(20,2) not null, "currency" varchar(3) not null, "reference_external_id" varchar(255) null, "reference_transaction_id" uuid null, "created_at" timestamptz not null default now(), "processed_at" timestamptz null, primary key ("id"));`);
    this.addSql(`create index "financial_transaction_reference_idx" on "financial_transactions" ("reference_external_id");`);
    this.addSql(`create index "financial_transaction_wallet_created_idx" on "financial_transactions" ("wallet_id", "created_at");`);
    this.addSql(`alter table "financial_transactions" add constraint "financial_transaction_external_id_unique" unique ("external_id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "financial_transactions" cascade;`);
  }

}
