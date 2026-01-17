import { createDailyMsg } from "./leetcode.js";

export async function sendDaily(client) {
  const channelId = process.env.CHANNEL_ID;
  const channel = await client.channels.fetch(channelId);
  const [greeting, reply, title] = await createDailyMsg();

  const message = await channel.send(greeting);
  const thread = await message.startThread({ name: title });
  await thread.send(reply);
  console.log("success!");
}
