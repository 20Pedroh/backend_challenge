import { Migration } from '@mikro-orm/migrations';

export class Migration20261106191242 extends Migration {

  override name = 'Migration20261106191242';

  override up(): void | Promise<void> {
    this.addSql(`alter table "ledger_entries" add constraint "ledger_transaction_id_unique" unique ("transaction_id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "ledger_entries" drop constraint "ledger_transaction_id_unique";`);
  }

}
