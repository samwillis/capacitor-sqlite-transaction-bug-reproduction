import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";

export async function testSQLite() {
  console.log("Opening database")
  const sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  const conn = await sqliteConnection.createConnection(
    "test",
    false,
    "",
    1,
    false
  );
  await conn.open();

  console.log("Creating table")
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);

  console.log("Inserting data")
  await conn.run("INSERT INTO items (name) VALUES (?)", ['test1'], false);

  const res1 = await conn.query("SELECT * FROM items");
  console.log(res1.values);

  console.log("Starting transaction 1")
  await conn.beginTransaction();
  await conn.run("INSERT INTO items (name) VALUES (?)", ['test2'], false);
  await conn.commitTransaction();

  const res2 = await conn.query("SELECT * FROM items");
  console.log(res2.values);

  console.log("Starting transaction 2")
  await conn.beginTransaction();
  await conn.run("INSERT INTO items (name) VALUES (?)", ['test3'], false);
  await conn.commitTransaction();

  console.log("Querying data")
  const res3 = await conn.query("SELECT * FROM items");
  console.log(res3.values);
}