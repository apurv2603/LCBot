import { SlashCommandBuilder } from "discord.js";
import { VerifyLCUser } from "../../services/leetcode.js";
import { getDB, saveDB } from "../../services/storage.js";
//all I want to do here is have a command that adds a user to a database.
// lets just start by writing function that will allow user to add username and respond with username has been added.
// also print this username to terminal.

// async function addUser()
const data = new SlashCommandBuilder()
  .setName("add")
  .setDescription("adds LC username to DB")
  .addStringOption((option) =>
    option
      .setName("lcusername")
      .setDescription("Your LeetCode username")
      .setRequired(true),
  );

async function execute(interaction) {
  const Distag = interaction.user.username;
  const DisID = interaction.user.id;
  const LCtag = interaction.options.getString("lcusername");
  //need to check if the LCtag is valid leetcode username.this will be done by checking the leetcode API for if the username is valid
  const valid = await VerifyLCUser(LCtag);
  if (valid == null) {
    await interaction.reply("could not find that username");
  } else {
    //map Discord ID DId to LCtag and this is a 1 to 1 relationship each discord user can have exactly one LCtag and vice versa.
    const db = getDB();
    db.users[DisID] = { lc: LCtag, streak: 0 };
    saveDB();
    await interaction.reply("binded " + Distag + " to " + LCtag);
  }
}
export { data, execute };
