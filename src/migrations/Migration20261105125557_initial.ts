import { Migration } from '@mikro-orm/migrations';

export class Migration20261105125557_initial extends Migration {

  override name = 'Migration20261105125557_initial';

  override up(): void | Promise<void> {
    this.addSql(`create table "wallets" ("id" uuid not null, "player_id" varchar(100) not null, "currency" varchar(3) not null, "balance" numeric(20,2) not null default '0.00', "version" int not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`);
    this.addSql(`alter table "wallets" add constraint "wallet_player_currency_unique" unique ("player_id", "currency");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "wallets" cascade;`);
  }

}
