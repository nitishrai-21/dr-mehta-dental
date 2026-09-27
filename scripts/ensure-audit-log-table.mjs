import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function ensureAuditLogTable() {
  try {
    await client.connect();

    const existingTable = await client.query(
      `SELECT to_regclass('public.audit_logs') AS table_name;`,
    );

    if (existingTable.rows[0]?.table_name) {
      console.log("Audit log table already exists.");
      return;
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" TEXT NOT NULL,
        "adminId" TEXT,
        "actorEmail" TEXT,
        "action" TEXT NOT NULL,
        "entityType" TEXT NOT NULL,
        "entityId" TEXT NOT NULL,
        "details" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "audit_logs_adminId_fkey"
          FOREIGN KEY ("adminId") REFERENCES "admins"("id")
          ON DELETE SET NULL ON UPDATE CASCADE
      );

      CREATE INDEX IF NOT EXISTS "audit_logs_entityType_entityId_idx"
        ON "audit_logs" ("entityType", "entityId");

      CREATE INDEX IF NOT EXISTS "audit_logs_adminId_idx"
        ON "audit_logs" ("adminId");

      CREATE INDEX IF NOT EXISTS "audit_logs_createdAt_idx"
        ON "audit_logs" ("createdAt");
    `);

    console.log("Audit log table created successfully.");
  } finally {
    await client.end();
  }
}

ensureAuditLogTable().catch((error) => {
  console.error("Failed to ensure audit log table:", error);
  process.exit(1);
});
