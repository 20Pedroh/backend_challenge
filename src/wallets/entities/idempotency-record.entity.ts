
import { randomUUID } from 'node:crypto';
import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';

@Entity({ tableName: 'idempotency_records' })
@Unique({
  name: 'idempotency_key_unique',
  properties: ['key'],
})
export class IdempotencyRecord {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'string', length: 255 })
  key!: string;

  @Property({ type: 'string', length: 64 })
  requestHash!: string;

  @Property({
    type: 'json',
    columnType: 'jsonb',
    nullable: true,
  })
  response: Record<string, unknown> | null = null;

  @Property({
    type: 'Date',
    columnType: 'timestamptz',
    defaultRaw: 'now()',
  })
  createdAt: Date = new Date();
}
