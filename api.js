const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser"); // body parser enables us to read data from a request body
const db = require("./notes"); // exposes the SQLLite db so we can run queries against it

// tells express to use the body parser
app.use(bodyParser.urlencoded({ extended: false }));

//handle GET requests
app.get("/notes", async (req, res) => {
  const { status, data } = await getNotes(req);
  res.status(status);
  if (data) res.json(data);
  else res.send();
});

//handle POST requests
app.post("/notes", async (req, res) => {
  const { status, data } = await postEvents(req);
  res.status(status);
  if (data) res.json(data);
  else res.end();
});

//handle PUT and DELETE requests by returning  405
app.put("/notes", async (req, res) => {
  res.status(405);
  res.end();
});
app.delete("/notes", async (req, res) => {
  res.status(405);
  res.end();
});

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});

async function getNotes(req) {
  let status = 500,
    data = null;
  try {
    if (req) {
      // wrap in promise to allow for sequential code flow
      await new Promise((resolve, reject) => {
        const sql = "SELECT * FROM notes";
        db.all(sql, (err, rows) => {
          if (!err) {
            if (rows.length > 0) {
              status = 200;
              data = {
                results_amount: rows.length,
                events: rows
              };
            } else {
              status = 204;
            }
          }
          resolve();
        });
      });
    } else {
      status = 400;
    }
  } catch (e) {
    console.error(e);
  }
  return { status, data };
}



async function postEvents(req) {
  let status = 500,
    data = null;
  try {
    const title = req.body.title;
    const ownerID = req.body.ownerID;
    if (title && descrip && date && image) {
      // wrap in promise to allow for sequential code flow
      await new Promise((resolve, reject) => {
        const sql =
          "INSERT INTO notes (ownerID,noteTitle)VALUES (?,?)";
        // use old style function syntax to access lastID,
        // see https://github.com/TryGhost/node-sqlite3/wiki/API
        db.run(sql, [title, ownerID], function (err, result) {
          if (!err) {
            status = 201;
            data = { id: this.lastID };
          }
          resolve();
        });
      });
    } else {
      status = 400;
    }
  } catch (e) {
    console.error(e);
  }
  return { status, data };
}
