import { SlashCommandBuilder } from "discord.js";
import { VerifyLCUser } from "../../services/leetcode.js";
import { DiscordToLC } from "../../services/storage.js";
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
  const Dusername = interaction.user.username;
  const DId = interaction.user.id;
  const LCtag = interaction.options._hoistedOptions[0].value;
  //need to check if the LCtag is valid leetcode username.this will be done by checking the leetcode API for if the username is valid
  const valid = await VerifyLCUser(LCtag);
  if (valid == null) {
    await interaction.reply("could not find that username");
  } else {
    //map Discord ID DId to LCtag and this is a 1 to 1 relationship each discord user can have exactly one LCtag and vice versa.
    DiscordToLC[DId] = LCtag;
    await interaction.reply("binded " + Dusername + " to " + LCtag);
  }
}
export { data, execute };
