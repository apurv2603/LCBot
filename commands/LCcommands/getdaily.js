import { SlashCommandBuilder } from "discord.js";
import { createDailyMsg } from "../../services/leetcode.js";
export const data = new SlashCommandBuilder()
  .setName("getdaily")
  .setDescription("Gets the Daily problem");

export async function execute(interaction) {
  await interaction.deferReply();
  const [greeting, reply, title] = await createDailyMsg();
  // { ephemeral: true }
  await interaction.editReply({ content: greeting });
  const msg = await interaction.fetchReply();
  const thread = await msg.startThread({ name: title });
  await thread.send(reply);
}
