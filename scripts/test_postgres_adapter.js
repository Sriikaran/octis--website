/**
 * Octis Marketing Website — PostgreSQL Storage Adapter Verification Suite
 * Verifies SQL parameterization, transaction management, constraint handling,
 * response contracts, and zero-silent-fallback rules.
 */

const assert = require('assert');

async function runPgAdapterVerification() {
  console.log('=== STARTING POSTGRESQL ADAPTER CODE & CONTRACT VERIFICATION ===\n');

  let passed = 0;
  let failed = 0;

  function test(description, fn) {
    try {
      fn();
      console.log(`  [PASS] ${description}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${description} ->`, err);
      failed++;
    }
  }

  async function testAsync(description, fn) {
    try {
      await fn();
      console.log(`  [PASS] ${description}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${description} ->`, err);
      failed++;
    }
  }

  // -------------------------------------------------------------------
  // TEST 1: Storage Mode Detection & Diagnostics
  // -------------------------------------------------------------------
  console.log('--- Test Group 1: Storage Architecture & Diagnostics ---');
  delete process.env.DEMO_DATABASE_URL;
  const { isDatabaseConfigured, getStorageDiagnostics } = require('../lib/demoStorage');

  test('Reports file adapter when DEMO_DATABASE_URL is unset', () => {
    assert.strictEqual(isDatabaseConfigured(), false);
    const diag = getStorageDiagnostics();
    assert.strictEqual(diag.activeAdapter, 'file');
    assert.strictEqual(diag.databaseConfigured, false);
    assert.strictEqual(diag.serverlessCompatible, false);
  });

  test('Reports postgresql adapter when DEMO_DATABASE_URL is set', () => {
    process.env.DEMO_DATABASE_URL = 'postgresql://octis_usr:dummy_secret@localhost:5432/octis_web_isolated';
    assert.strictEqual(isDatabaseConfigured(), true);
    const diag = getStorageDiagnostics();
    assert.strictEqual(diag.activeAdapter, 'postgresql');
    assert.strictEqual(diag.databaseConfigured, true);
    assert.strictEqual(diag.serverlessCompatible, true);
    assert.ok(diag.databaseUrlMasked.includes('****'));
    assert.ok(!diag.databaseUrlMasked.includes('dummy_secret'));
  });

  // -------------------------------------------------------------------
  // TEST 2: Zero Silent Fallback Verification
  // -------------------------------------------------------------------
  console.log('\n--- Test Group 2: Zero-Silent-Fallback Production Rule ---');
  await testAsync('Fails safely with error when database is configured but unreachable (No silent JSON fallback)', async () => {
    // Configured with unreachable dummy port
    process.env.DEMO_DATABASE_URL = 'postgresql://invalid_user:invalid_pass@127.0.0.1:59999/dummy_db?connection_timeout=1';
    const poolMod = require('../lib/db/pool');
    const { getAvailableSlots } = require('../lib/demoStorage');
    let threw = false;
    try {
      await getAvailableSlots('2026-11-18');
    } catch (err) {
      threw = true;
      assert.ok(err.message.includes('ECONNREFUSED') || err.message.includes('timeout') || err.message.includes('connect'));
    }
    await poolMod.closeDbPool();
    delete process.env.DEMO_DATABASE_URL;
    assert.strictEqual(threw, true, 'Expected operation to throw database error rather than silently fallback to file storage');
  });

  // -------------------------------------------------------------------
  // TEST 3: PostgreSQL Query Parameterization & Transaction Contracts
  // -------------------------------------------------------------------
  console.log('\n--- Test Group 3: SQL Parameterization & Transaction Mocking ---');
  process.env.DEMO_DATABASE_URL = 'postgresql://mock_user:mock_pass@localhost:5432/mock_db';
  const {
    getAvailableSlotsPg,
    createDemoBookingPg,
    listAllBookingsPg,
    updateBookingStatusPg,
    saveContactInquiryPg,
  } = require('../lib/db/postgresAdapter');

  // Create a Mock Pool & Client to inspect SQL queries and parameters
  function createMockPool(options = {}) {
    const executedQueries = [];
    const client = {
      query: async (sql, params = []) => {
        executedQueries.push({ sql: sql.trim(), params });
        const normSql = sql.replace(/\s+/g, ' ').trim();
        if (options.onQuery) return options.onQuery(sql, params);

        if (normSql.includes('SELECT start_time FROM demo_bookings')) {
          return { rows: [{ start_time: '10:00' }] };
        }
        if (normSql.includes('SELECT id FROM demo_bookings') && normSql.includes('FOR UPDATE')) {
          if (options.hasConflict) {
            return { rows: [{ id: 1 }] };
          }
          return { rows: [] };
        }
        if (normSql.includes('INSERT INTO demo_enquiries')) {
          return {
            rows: [
              {
                enquiry_id: params[0],
                source: params[1],
                reference_id: params[2],
                name: params[3],
                showroom_name: params[4],
                email: params[5],
                phone: params[6],
                city: params[7],
                product: params[8],
                business_type: params[9],
                branches: params[10],
                challenges: params[11],
                message: params[12],
                created_at: new Date().toISOString(),
              },
            ],
          };
        }
        if (normSql.includes('INSERT INTO demo_bookings')) {
          if (options.throwUniqueConstraint) {
            const err = new Error('duplicate key value violates unique constraint "uq_active_booking_slot"');
            err.code = '23505';
            throw err;
          }
          return {
            rows: [
              {
                booking_id: params[0],
                enquiry_id: params[1],
                reference_id: params[2],
                product: params[3],
                booking_date: params[4],
                start_time: params[5],
                end_time: params[6],
                timezone: params[7],
                status: params[8],
                created_at: params[9],
                updated_at: params[9],
                audit_history: params[10],
              },
            ],
          };
        }
        if (normSql.includes('FROM demo_bookings b JOIN demo_enquiries e')) {
          return {
            rows: [
              {
                bookingId: 'OCT-DEMO-1',
                enquiryId: 'ENQ-1',
                referenceId: 'OCT-DEMO-1',
                product: 'jewellery-erp',
                date: '2026-11-18',
                startTime: '10:45',
                endTime: '11:15',
                timezone: 'Asia/Kolkata',
                status: 'confirmed',
                auditHistory: [],
                customerName: 'Mock User',
                showroomName: 'Mock Jewel',
                email: 'mock@example.com',
                phone: '9876543210',
              },
            ],
          };
        }
        if (normSql.includes('SELECT * FROM demo_bookings WHERE reference_id = $1 FOR UPDATE')) {
          return {
            rows: [
              {
                booking_id: 'OCT-DEMO-1',
                enquiry_id: 'ENQ-1',
                reference_id: params[0],
                status: 'confirmed',
                audit_history: '[]',
              },
            ],
          };
        }
        if (normSql.includes('UPDATE demo_bookings')) {
          return {
            rows: [
              {
                booking_id: 'OCT-DEMO-1',
                enquiry_id: 'ENQ-1',
                reference_id: params[3],
                status: params[0],
                updated_at: params[1],
                audit_history: params[2],
              },
            ],
          };
        }
        return { rows: [] };
      },
      release: () => {},
    };

    return {
      pool: {
        query: client.query,
        connect: async () => client,
      },
      executedQueries,
    };
  }

  // Inject mock pool into pool module
  const poolModule = require('../lib/db/pool');

  await testAsync('getAvailableSlotsPg uses parameterized query and respects booked slots', async () => {
    const { pool, executedQueries } = createMockPool();
    poolModule.setMockDbPool(pool);

    const res = await getAvailableSlotsPg('2026-11-18'); // Wednesday
    assert.strictEqual(res.isAvailableDay, true);
    assert.strictEqual(executedQueries.length, 1);
    const normQ = executedQueries[0].sql.replace(/\s+/g, ' ');
    assert.ok(normQ.includes('SELECT start_time FROM demo_bookings WHERE booking_date = $1'));
    assert.deepStrictEqual(executedQueries[0].params, ['2026-11-18']);

    const slot10 = res.slots.find((s) => s.time === '10:00');
    assert.strictEqual(slot10.available, false);
    assert.strictEqual(slot10.reason, 'Slot already reserved');

    const slot1045 = res.slots.find((s) => s.time === '10:45');
    assert.strictEqual(slot1045.available, true);
  });

  await testAsync('createDemoBookingPg executes BEGIN, row lock FOR UPDATE, atomic INSERTs, and COMMIT', async () => {
    const { pool, executedQueries } = createMockPool();
    poolModule.setMockDbPool(pool);

    const payload = {
      name: 'Aditi Rao',
      showroomName: 'Rao Jewellers',
      email: 'aditi@example.com',
      phone: '9876543210',
      city: 'Hyderabad',
      product: 'jewellery-erp',
      date: '2026-11-18',
      time: '11:30',
    };

    const res = await createDemoBookingPg(payload);
    assert.strictEqual(res.success, true);
    assert.ok(res.referenceId.startsWith('OCT-DEMO-20261118-'));

    const queries = executedQueries.map((q) => q.sql);
    assert.strictEqual(queries[0], 'BEGIN');
    assert.ok(queries[1].includes('FOR UPDATE'));
    assert.ok(queries[2].includes('INSERT INTO demo_enquiries'));
    assert.ok(queries[3].includes('INSERT INTO demo_bookings'));
    assert.strictEqual(queries[4], 'COMMIT');
  });

  await testAsync('createDemoBookingPg executes ROLLBACK on slot conflict (FOR UPDATE collision)', async () => {
    const { pool, executedQueries } = createMockPool({ hasConflict: true });
    poolModule.setMockDbPool(pool);

    const res = await createDemoBookingPg({
      name: 'Conflict User',
      showroomName: 'Conflicting Showroom',
      email: 'conflict@example.com',
      phone: '9876543210',
      city: 'Delhi',
      product: 'jewellery-erp',
      date: '2026-11-18',
      time: '11:30',
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'SLOT_UNAVAILABLE');

    const queries = executedQueries.map((q) => q.sql);
    assert.strictEqual(queries[0], 'BEGIN');
    assert.ok(queries[1].includes('FOR UPDATE'));
    assert.strictEqual(queries[2], 'ROLLBACK');
  });

  await testAsync('createDemoBookingPg catches unique index violation (23505) and returns SLOT_UNAVAILABLE', async () => {
    const { pool, executedQueries } = createMockPool({ throwUniqueConstraint: true });
    poolModule.setMockDbPool(pool);

    const res = await createDemoBookingPg({
      name: 'Race Condition User',
      showroomName: 'Race Showroom',
      email: 'race@example.com',
      phone: '9876543210',
      city: 'Kolkata',
      product: 'jewellery-erp',
      date: '2026-11-18',
      time: '14:00',
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'SLOT_UNAVAILABLE');

    const queries = executedQueries.map((q) => q.sql);
    assert.strictEqual(queries[0], 'BEGIN');
    assert.strictEqual(queries[queries.length - 1], 'ROLLBACK');
  });

  await testAsync('listAllBookingsPg generates parameterized SQL filters for status, product, search', async () => {
    const { pool, executedQueries } = createMockPool();
    poolModule.setMockDbPool(pool);

    const res = await listAllBookingsPg({ status: 'confirmed', product: 'jewellery-erp', search: 'Mock' });
    assert.ok(Array.isArray(res));
    assert.strictEqual(res.length, 1);
    assert.strictEqual(res[0].customerName, 'Mock User');

    const query = executedQueries[0];
    assert.ok(query.sql.includes('LOWER(b.status) = LOWER($1)'));
    assert.ok(query.sql.includes('LOWER(b.product) = LOWER($2)'));
    assert.ok(query.sql.includes('ILIKE $3'));
    assert.deepStrictEqual(query.params, ['confirmed', 'jewellery-erp', '%Mock%']);
  });

  await testAsync('updateBookingStatusPg executes FOR UPDATE row lock and updates status with audit log', async () => {
    const { pool, executedQueries } = createMockPool();
    poolModule.setMockDbPool(pool);

    const res = await updateBookingStatusPg('OCT-DEMO-1', 'completed', 'Client attended');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.booking.status, 'completed');

    const queries = executedQueries.map((q) => q.sql);
    assert.strictEqual(queries[0], 'BEGIN');
    assert.ok(queries[1].includes('FOR UPDATE'));
    assert.ok(queries[2].includes('UPDATE demo_bookings'));
    assert.strictEqual(queries[3], 'COMMIT');
  });

  await testAsync('saveContactInquiryPg inserts contact inquiry with source=contact_form', async () => {
    const { pool, executedQueries } = createMockPool();
    poolModule.setMockDbPool(pool);

    const res = await saveContactInquiryPg({
      name: 'Advisory Client',
      showroomName: 'Elite Jewels',
      email: 'elite@example.com',
      phone: '9876543210',
      city: 'Surat',
      product: 'bulion',
      message: 'Need trading platform info',
    });

    assert.strictEqual(res.success, true);
    assert.ok(res.enquiryId.startsWith('ENQ-CONTACT-'));

    const query = executedQueries[0];
    assert.ok(query.sql.includes('INSERT INTO demo_enquiries'));
    assert.strictEqual(query.params[1], 'contact_form');
    assert.strictEqual(query.params[3], 'Advisory Client');
  });

  // Restore original pool
  poolModule.resetMockDbPool();
  delete process.env.DEMO_DATABASE_URL;

  console.log(`\n======================================================`);
  console.log(`POSTGRESQL ADAPTER TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runPgAdapterVerification().catch((e) => {
  console.error(e);
  process.exit(1);
});
