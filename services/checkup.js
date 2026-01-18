import { getDB, saveDB } from "./storage.js";
import { CompletedDaily } from "./leetcode.js";

async function CompletionMsg() {
  const db = getDB();
  const today = db.today;
  if (!today) {
    return null;
  }
  const completedBy = {};
  let groupComplete = false;
  let streakToId = {};
  for (const [DId, value] of Object.entries(db.users)) {
    const lcTag = value.lc;
    let streak = 0;
    if (await CompletedDaily(lcTag, db.history[today].titleSlug)) {
      groupComplete = true;
      completedBy[DId] = true;
      streak = value.streak + 1;
      if (streak in streakToId) {
        streakToId[streak].push(DId);
      } else {
        streakToId[streak] = [DId];
      }
    } else {
      completedBy[DId] = false;
    }
    db.users[DId].streak = streak;
  }
  db.history[today].completedBy = completedBy;
  if (groupComplete) {
    db.groupStreak = db.groupStreak + 1;
  } else {
    db.groupStreak = 0;
    return null;
  }
  saveDB();
  //now I need the ordering sorted by streaks. to do this I should have dictionary where keys are streaks and values are
  // array of discord Id's with that streak. Then sort the keys and have output based on sorted order
  //now I sort the keys and have order based on that
  const sortedStreak = Object.keys(streakToId).sort().reverse();
  let msg = `Your group is on a ${db.groupStreak} day streak! 🔥 Here are the results:\n👑 `;
  for (const st of sortedStreak) {
    msg += `${st} consecutive days: `;
    for (const id of streakToId[st]) {
      msg += `<@${id}> `;
    }
    msg += "\n";
  }
  return msg;
}

export async function sendCompletionMsg(client) {
  const channelId = process.env.CHANNEL_ID;
  const channel = await client.channels.fetch(channelId);
  const msg = await CompletionMsg();
  if (!msg) {
    return;
  }
  await channel.send(msg);
}
