// need to check who all finished update the Database accordingly.
// sending message will have a streak associated it with the whole group along with the streak per user.
//EXAMPLE RESPONSE:
// Your group is on a 63 day streak! 🔥 Here are yesterday's results:
// 👑 10 concetuive days:  @Raul (taco flavored) @dhiraj @Jatin
// 1 concetuve day: steak @jewemy (Very Short Flavored)

// if number is 69 have a 69 (nice)
import { SlashCommandBuilder } from "discord.js";
import { getDB, saveDB } from "../../services/storage.js";
import { CompletedDaily } from "../../services/leetcode.js";

const data = new SlashCommandBuilder()
  .setName("eodcheck")
  .setDescription("checks who completed and then updates the db accordingly");

async function execute(interaction) {
  await interaction.deferReply();
  const db = getDB();
  const users = db.users;
  const today = db.today;
  const dailySlug = db.history[today].titleSlug;
  const completedBy = {};
  let groupComplete = false;
  let streakToId = {};
  console.log(dailySlug);
  for (const [DId, value] of Object.entries(users)) {
    const lcTag = value.lc;
    let streak = 0;
    if (await CompletedDaily(lcTag, dailySlug)) {
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
      // set the Id:false
    }
    db.users[DId].streak = streak;
  }
  if (groupComplete) {
    db.groupStreak = db.groupStreak + 1;
  } else {
    db.groupStreak = 0;
  }
  db.history[today].completedBy = completedBy;
  //now I need the ordering sorted by streaks. to do this I should have dictionary where keys are streaks and values are
  // array of discord Id's with that streak. Then sort the keys and have output based on sorted order
  console.log(streakToId);
  //now I sort the keys and have order based on that
  const sortedStreak = Object.keys(streakToId).sort().reverse();
  let msg = `Your group is on a ${db.groupStreak} day streak! 🔥 Here are the results:\n👑 `;
  for (const st of sortedStreak) {
    msg += `${st} consecutive days: `;
    for (const id of streakToId[st]) {
      msg += `<@${id}> `;
    }
    msg += "\n";
  } // const mention = `<@${tmp}>`;
  interaction.editReply(msg);
  saveDB();
}

export { data, execute };
