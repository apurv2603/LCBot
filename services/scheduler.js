import cron from "node-cron";
import { test } from "./daily.js";
import { checkup } from "./checkup.js";
let pingTask = null;
let pongTask = null;

export function startPingScheduler(client) {
  if (pingTask && pongTask) return; // already running

  // Example: run every day at 9:00 AM Dubai time
  if (!pingTask) {
    pingTask = cron.schedule(
      "*/1 * * * *",
      async () => {
        await test(client);
      },
      {
        timezone: "Asia/Dubai",
      },
    );
  }
  if (!pongTask) {
    pongTask = cron.schedule(
      "*/1 * * * *",
      async () => {
        await checkup(client);
      },
      {
        timezone: "Asia/Dubai",
      },
    );
  }
}
