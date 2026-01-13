import { SlashCommandBuilder } from "discord.js";
import { getDaily } from "../../services/leetcode.js";
import { getHoliday } from "../../services/holiday.js";
import { getDB, saveDB } from "../../services/storage.js";
export const data = new SlashCommandBuilder()
  .setName("getdaily")
  .setDescription("Gets the Daily problem");

export async function execute(interaction) {
  await interaction.deferReply();
  // { ephemeral: true }
  const db = getDB();
  const dailyProb = await getDaily();
  const link = "https://leetcode.com" + dailyProb.link;
  const reply =
    "**Title:** " +
    dailyProb.question.title +
    "\n**Difficulty:** " +
    dailyProb.question.difficulty +
    "\n**Link:** " +
    link;
  const [year, month, day] = dailyProb.date.split("-"); // YYYY-MM-DD
  const greeting = await getHoliday(month, day);
  await interaction.editReply({ content: greeting });
  const msg = await interaction.fetchReply();
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
  // by the time this function runs we will have already done the verification of who finished problems so we can add stuff easily
  db.today = dailyProb.date; // today: "YYYY-MM-DD"
  //history: {
  //     [date: "YYYY-MM-DD"]: {
  //       link: string,
  //       greeting: string,
  //       completedBy: {
  //         [discordId: string]: true   // set of who completed that date
  //       }
  //     }
  //   }
  db.history[dailyProb.date] = {
    link: link,
    greeting: greeting,
    completedBy: {},
  };
  saveDB();
}
