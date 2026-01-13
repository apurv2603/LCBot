import { SlashCommandBuilder } from "discord.js";
import { getDaily } from "../../services/leetcode.js";
import { getHoliday } from "../../services/holiday.js";
export const data = new SlashCommandBuilder()
  .setName("getdaily")
  .setDescription("Gets the Daily problem");

export async function execute(interaction) {
  const dailyProb = await getDaily();
  const link = "https://leetcode.com" + dailyProb.link;
  const reply =
    "**Title:** " +
    dailyProb.question.title +
    "\n**Difficulty:** " +
    dailyProb.question.difficulty +
    "\n**Link:** " +
    link;
  const [year, month, day] = dailyProb.date.split("-");
  const greeting = await getHoliday(month, day);
  console.log(greeting);
  const response = await interaction.reply({
    content: greeting,
    withResponse: true,
  });
  const msg = response.resource.message;
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
  const title =
    "LC Daily (" + intToMonth[month] + " " + day + "th " + year + ")";
  const thread = await msg.startThread({ name: title });
  await thread.send(reply);
}
