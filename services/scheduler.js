import cron from "node-cron";
import { sendDaily } from "./daily.js";
import { sendCompletionMsg } from "./checkup.js";
let dailyProblemTask = null;
let checkUpTask = null;

export function startPingScheduler(client) {
  if (dailyProblemTask && checkUpTask) return; // already running

  // Example: run every day at 9:00 AM Dubai time
  if (!checkUpTask) {
    checkUpTask = cron.schedule(
      "10 19 * * *", // 7:05 PM
      async () => {
        await sendCompletionMsg(client);
      },
      {
        timezone: "America/New_York",
      },
    );
  }
  if (!dailyProblemTask) {
    dailyProblemTask = cron.schedule(
      "10 19 * * *", // 7:05 PM
      async () => {
        await sendDaily(client);
      },
      {
        timezone: "America/New_York",
      },
    );
  }
}
