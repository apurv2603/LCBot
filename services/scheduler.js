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
      "*/1 * * * *",
      async () => {
        await sendCompletionMsg(client);
      },
      {
        timezone: "Asia/Dubai",
      },
    );
  }
  if (!dailyProblemTask) {
    dailyProblemTask = cron.schedule(
      "*/1 * * * *",
      async () => {
        await sendDaily(client);
      },
      {
        timezone: "Asia/Dubai",
      },
    );
  }
}
