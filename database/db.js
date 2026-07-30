// database/db.js
// Inisialisasi koneksi SQLite (async/await) menggunakan sqlite + sqlite3.

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DB_PATH } from "../config.js";
import { logger } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let dbInstance = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  const dbDir = path.dirname(path.resolve(DB_PATH));
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  dbInstance = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await dbInstance.exec(schema);

  logger.info("Database SQLite siap digunakan:", DB_PATH);
  return dbInstance;
}
