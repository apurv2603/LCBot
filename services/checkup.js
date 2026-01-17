async function checkup(client) {
  const channelId = process.env.CHANNEL_ID;
  const channel = await client.channels.fetch(channelId);
  await channel.send("new pong");
}

export { checkup };
