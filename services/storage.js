// storage.js (ESM) - minimal + atomic save
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "db.json");

const DEFAULT_DB = {
  today: null,
  group: { streak: 0, lastCompletedDate: null },
  users: {},
  history: {},
};

let db = DEFAULT_DB;

if (fs.existsSync(DB_PATH)) {
  db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
} else {
  fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf8");
}

function getDB() {
  return db;
}

function saveDB() {
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_PATH);
}

export { getDB, saveDB };

// DB schema
// {
//   today: "YYYY-MM-DD",
//
//   group: {
//     streak: number,                 // current group streak
//     lastCompletedDate: string|null  // last date the group streak was advanced
//   },
//
//   users: {
//     [discordId: string]: {
//       lc: string,
//       streak: number,               // current user streak
//       lastCompletedDate: string|null
//     }
//   },
//
//   history: {
//     [date: "YYYY-MM-DD"]: {
//       link: string,
//       greeting: string,
//       completedBy: {
//         [discordId: string]: true   // set of who completed that date
//       }
//     }
//   }
// }
