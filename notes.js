// load sqlite3, provide extra info for debugging
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("notes.sqlite", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to SQLite database");
    // create table (throws error if already exists)
    db.run(
      `CREATE TABLE notes (noteID INTEGER PRIMARY KEY AUTOINCREMENT,ownerID INTEGER,creationDT text,noteTitle texts);`,
      (err) => {
        if (err) {
            console.log(err);
          console.error("Table comments already exists");
        } else {
          console.error("Table comments created");
          // insert some test data
          const insert = "INSERT INTO notes (ownerID,noteTitle,creationDT) VALUES (?,?,CURRENT_TIMESTAMP)";
          db.run(insert, [12345, "test note 1"]);
          db.run(insert, [12345, "test note 2"]);
        }
      }
    );
  }
});
module.exports = db;
