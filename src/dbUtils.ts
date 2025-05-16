import { compareStrings } from "./index";
import { Pool, QueryResult } from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "default_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "default_database",
  password: process.env.DB_PASSWORD || "default_password",
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

export async function findSimilarEntries(
  target: string,
  tableName: string,
  columnName: string,
  threshold: number,
): Promise<Array<{ id: string; value: string | null; similarity: number }>> {
  const client = await pool.connect();
  try {
    const query = `SELECT id, ${columnName} FROM ${tableName}`;
    const result: QueryResult<{ id: string; [key: string]: string | null }> =
      await client.query(query);

    const similarEntries = result.rows
      .map((row: { id: string; [key: string]: string | null }) => {
        const similarity = row[columnName]
          ? compareStrings(target, row[columnName])
          : 0;
        return { id: String(row.id), value: row[columnName], similarity };
      })
      .filter(
        (entry: { id: string; value: string | null; similarity: number }) =>
          entry.similarity >= threshold,
      )
      .sort((a, b) => b.similarity - a.similarity);

    return similarEntries;
  } finally {
    client.release();
  }
}

export async function insertStringEntry(
  tableName: string,
  columnName: string,
  value: string,
): Promise<void> {
  const client = await pool.connect();
  try {
    const query = `INSERT INTO ${tableName} (${columnName}) VALUES ($1)`;
    await client.query(query, [value]);
  } finally {
    client.release();
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  await pool.end();
}

export function configureDatabase(config: {
  user?: string;
  host?: string;
  database?: string;
  password?: string;
  port?: number;
}): void {
  pool.options = {
    ...pool.options,
    ...config,
  };
}
