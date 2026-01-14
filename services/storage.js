import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "db.json");

const DEFAULT_DB = {
  today: null,
  groupStreak: 0,
  users: {},
  history: {},
};

let db;

// helper: create db.json from DEFAULT_DB
function writeDefaultDB() {
  db = structuredClone(DEFAULT_DB);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

// Load DB
try {
  if (!fs.existsSync(DB_PATH)) {
    writeDefaultDB();
  } else {
    const raw = fs.readFileSync(DB_PATH, "utf8").trim();

    // if file exists but is empty/whitespace
    if (!raw) {
      writeDefaultDB();
    } else {
      db = JSON.parse(raw);
    }
  }
} catch (err) {
  // If JSON is corrupted, recover by recreating file
  console.error("DB load failed, recreating db.json:", err.message);
  writeDefaultDB();
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
//       titleSlug: string
//       greeting: string,
//       completedBy: {
//         [discordId: string]: true   // set of who completed that date
//       }
//     }
//   }
// }
