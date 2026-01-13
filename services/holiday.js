export async function getHoliday(mm, dd) {
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/holidays/${mm}/${dd}`;
  const res = await fetch(url, {
    headers: {
      "user-agent": "LC-monkey-bot/1.0",
    },
  });
  if (!res.ok) {
    return "Happy coding!";
  }
  const data = await res.json();
  const holidays = data.holidays ?? [];
  if (holidays.length === 0) {
    return "Happy coding!";
  }
  let pick = holidays[Math.floor(Math.random() * holidays.length)];
  while (pick.text.length > 45) {
    pick = holidays[Math.floor(Math.random() * holidays.length)];
  }
  return `Happy ${pick.text}!`;
}

// const trial = await getHappyThingToday("01", "13");
// console.log(trial);
