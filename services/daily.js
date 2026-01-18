import { getDaily } from "./leetcode.js";
import { getDB, saveDB } from "./storage.js";
import { getHoliday } from "./holiday.js";

export async function createDailyMsg() {
  const db = getDB();
  const dailyProb = await getDaily();
  const link = "https://leetcode.com" + dailyProb.link;
  const msg =
    "**Title:** " +
    dailyProb.question.title +
    "\n**Difficulty:** " +
    dailyProb.question.difficulty +
    "\n**Link:** " +
    link;
  const [year, month, day] = dailyProb.date.split("-"); // YYYY-MM-DD
  const greeting = await getHoliday(month, day);
  const intToMonth = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  const threadTitle =
    "LC Daily (" + intToMonth[month] + " " + day + "th " + year + ")";
  // by the time this function runs we will have already done the verification of who finished problems so we can add stuff easily
  db.today = dailyProb.date; // today: "YYYY-MM-DD"
  db.history[dailyProb.date] = {
    link: link,
    titleSlug: dailyProb.question.titleSlug,
    greeting: greeting,
    completedBy: {},
  };
  saveDB();
  return [greeting, msg, threadTitle];
}

export async function sendDaily(client) {
  const channelId = process.env.CHANNEL_ID;
  const channel = await client.channels.fetch(channelId);
  const [greeting, reply, title] = await createDailyMsg();

  const message = await channel.send(greeting);
  const thread = await message.startThread({ name: title });
  await thread.send(reply);
}
