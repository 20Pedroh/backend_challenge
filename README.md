<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Backend Challenge — Test Documentation

## 1. Overview

This document records the tests and validations performed during the development of the financial wallet API.

The main objective is to ensure financial integrity, transaction safety, idempotency, and reliable data persistence.

## 2. Technology Stack

- **Runtime:** Bun
- **Language:** TypeScript
- **Framework:** NestJS 12
- **Database:** PostgreSQL 17
- **ORM:** MikroORM
- **Monetary precision:** Decimal.js
- **Automated testing:** Bun Test
- **Infrastructure:** Docker Compose

## 3. Automated Tests

### 3.1. Unit Tests

**Money Value Object**

Automated tests have been implemented for the `Money` value object, covering:

- Monetary value creation.
- Decimal precision.
- Addition and subtraction.
- Monetary value comparisons.
- Currency compatibility.
- Validation of negative values and invalid formats.

**Result:** 10 tests passed.

### 3.2. Application Tests

The default NestJS application controller test was executed successfully.

Command:

```bash
bun test
```

The test verifies that the application controller responds correctly to a request sent to the root endpoint.

**Result:** Passed.

### 3.3. End-to-End Tests

Command:

```bash
bun run test:e2e
```

The existing E2E test verifies that the application responds correctly to an HTTP GET request on the `/` endpoint.

**Result:** Passed.

> Note: Current E2E coverage is limited to the root endpoint. Additional coverage is still required for wallet operations and financial endpoints.

## 4. Build and Runtime Validation

The following commands were executed successfully:

### Build

```bash
bun run build
```

Validates TypeScript compilation and generates the production build.

### Production Runtime

```bash
bun run start:prod
```

Validates that the compiled application starts using the Bun runtime.

### Lint

```bash
bun run lint
```

Runs Oxlint against the source code and test directories.

## 5. Database Validation

PostgreSQL 17 was started using Docker Compose.

The container health check confirmed that the database was ready to accept connections.

The following database structures have been created:

- `wallets`: stores wallet information.
- `ledger_entries`: stores financial movement records.
- `idempotency_records`: stores idempotency keys and original responses.
- `financial_transactions`: stores financial transactions and their references.

Constraints and indexes were also added to strengthen data integrity, including:

- Wallet uniqueness per player and currency.
- Idempotency key uniqueness.
- Transaction ID uniqueness in the ledger.
- Indexes for wallet and transaction reference queries.

## 6. Manual API Tests

HTTP requests were performed to validate credit and debit operations.

### 6.1. Wallet Creation

A wallet was successfully created for a player using BRL as its currency.

**Result:** Passed.

### 6.2. Credit Operation

An initial credit of R$ 100.00 was performed, followed by another credit of R$ 25.00.

**Result:** The wallet balance was correctly updated to R$ 125.00.

### 6.3. Concurrency

Ten simultaneous credit operations were executed, each using a different idempotency key.

**Result:** All operations were processed successfully, with no lost updates. The final balance was R$ 135.00.

### 6.4. Concurrent Idempotency

Ten simultaneous requests were sent using the same idempotency key and identical payload.

**Result:** The operation was applied only once, preventing duplicate credits.

### 6.5. Debit Operation

A debit of R$ 20.00 was successfully performed.

**Result:** The wallet balance was correctly updated to R$ 125.00.

### 6.6. Insufficient Balance Protection

A debit of R$ 200.00 was attempted while the available balance was lower.

**Result:** The API returned HTTP 400 (Bad Request), preserving the wallet balance and version.

### 6.7. Debit Replay

A debit operation of R$ 5.00 was performed. The same request was subsequently submitted again using the same idempotency key.

**Result:** The original response was reused without generating a second financial movement.

### 6.8. Ledger Integrity

A direct PostgreSQL query was performed to verify the ledger entry associated with the previous debit operation.

**Result:** Only one corresponding ledger entry was found.

## 7. Pending Features and Tests

The following items still require implementation or specific validation:

- Automated tests for wallet creation, credit, and debit operations.
- Concurrency tests involving simultaneous credit and debit operations.
- Idempotency tests using different payloads with the same key.
- Processing of BET, WIN, LOSS, REFUND, and ROLLBACK events.
- Handling of out-of-order transaction references.
- Guaranteeing that each transaction can only be reversed once.
- Inbox and Outbox implementation and testing.
- Message broker integration and ACK validation only after database commit.
- Failure handling, retries, and processing recovery tests.
- Consistency tests across wallets, transactions, and ledger entries.
- Multi-instance application execution tests.
- Metrics and observability implementation and validation.

## 8. Running the Tests

Run the following commands from the project root directory.

```bash
# Run automated tests
bun test

# Run End-to-End tests
bun run test:e2e

# Generate production build
bun run build

# Start the production application
bun run start:prod

# Run lint
bun run lint
```

## 9. Final Notes

So far, the fundamentals of monetary precision, PostgreSQL persistence, credit and debit operations, concurrency, and idempotency have been validated.

The next development steps focus on financial event processing, message broker integration, recovery mechanisms, and expanding automated test coverage.
