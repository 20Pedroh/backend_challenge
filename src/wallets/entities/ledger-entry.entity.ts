
import { randomUUID } from 'node:crypto';
import {
  Entity,
  PrimaryKey,
  Property,
  Index,
} from '@mikro-orm/decorators/legacy';

@Entity({ tableName: 'ledger_entries' })
@Index({
  name: 'ledger_wallet_created_at_idx',
  properties: ['walletId', 'createdAt'],
})
export class LedgerEntry {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'string', columnType: 'uuid' })
  walletId!: string;

  @Property({ type: 'string', columnType: 'uuid' })
  transactionId!: string;

  @Property({ type: 'string', length: 20 })
  type!: string;

  @Property({ type: 'string', columnType: 'numeric(20,2)' })
  amount!: string;

  @Property({ type: 'string', length: 3 })
  currency!: string;

  @Property({ type: 'string', columnType: 'numeric(20,2)' })
  balanceAfter!: string;

  @Property({
    type: 'Date',
    columnType: 'timestamptz',
    defaultRaw: 'now()',
  })
  createdAt: Date = new Date();
}
