import cron from "node-cron";
let pingTask = null;
export function startPingScheduler(client) {
  if (pingTask) return; // already running
  // Example: run every day at 9:00 AM Dubai time
  pingTask = cron.schedule(
    "*/1 * * * *",
    async () => {
      const channelId = process.env.CHANNEL_ID;
      const channel = await client.channels.fetch(channelId);
      await channel.send("ping");
      console.log("Scheduled ping sent");
    },
    { timezone: "Asia/Dubai" },
  );
}
