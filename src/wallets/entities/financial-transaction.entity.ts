
import { randomUUID } from 'node:crypto';
import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
  Index,
} from '@mikro-orm/decorators/legacy';

@Entity({ tableName: 'financial_transactions' })
@Unique({
  name: 'financial_transaction_external_id_unique',
  properties: ['externalId'],
})
@Index({
  name: 'financial_transaction_wallet_created_idx',
  properties: ['walletId', 'createdAt'],
})
@Index({
  name: 'financial_transaction_reference_idx',
  properties: ['referenceExternalId'],
})
export class FinancialTransaction {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'string', length: 255 })
  externalId!: string;

  @Property({ type: 'string', columnType: 'uuid' })
  walletId!: string;

  @Property({ type: 'string', length: 20 })
  type!: string;

  @Property({ type: 'string', length: 30 })
  status!: string;

  @Property({ type: 'string', columnType: 'numeric(20,2)' })
  amount!: string;

  @Property({ type: 'string', length: 3 })
  currency!: string;

  @Property({
    type: 'string',
    length: 255,
    nullable: true,
  })
  referenceExternalId: string | null = null;

  @Property({
    type: 'string',
    columnType: 'uuid',
    nullable: true,
  })
  referenceTransactionId: string | null = null;

  @Property({
    type: 'Date',
    columnType: 'timestamptz',
    defaultRaw: 'now()',
  })
  createdAt: Date = new Date();

  @Property({
    type: 'Date',
    columnType: 'timestamptz',
    nullable: true,
  })
  processedAt: Date | null = null;
}
