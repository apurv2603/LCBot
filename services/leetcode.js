//need a function to authenticate LC username
import axios from "axios";
import { getDB, saveDB } from "./storage.js";
import { getHoliday } from "./holiday.js";

// curl 'https://leetcode.com/graphql' \
// -H 'content-type: application/json' \
// --data-raw '{
//   "query": "query ($username: String!) { matchedUser(username: $username) { username } }",
//   "variables": { "username": "WHATEVEER USERNAME" }
// }'
// this is the curl command that gives the username and returns null if it doesn't exist I just need this as an axios thing.
export async function VerifyLCUser(username) {
  const endpoint = "https://leetcode.com/graphql";
  const query = `
    query ($username: String!) {
      matchedUser(username: $username) {
        username
      }
    }
  `;
  const { data } = await axios.post(
    endpoint,
    { query, variables: { username } },
    {
      headers: {
        "content-type": "application/json",
      },
    },
  );
  return data.data?.matchedUser;
}

//function to retrieve todays daily.
//curl 'https://leetcode.com/graphql' \
// -H 'content-type: application/json' \
// --data-raw '{
//   "query": "query questionOfToday { activeDailyCodingChallengeQuestion { date link question{title difficulty } } }",
//   "variables": {}
// }'
// that is the curl command now we need to just make it js function
async function getDaily() {
  const endpoint = "https://leetcode.com/graphql";
  const query = `query questionOfToday {
      activeDailyCodingChallengeQuestion {
        date link question {title difficulty titleSlug }
      } }`;
  const { data } = await axios.post(
    endpoint,
    { query, variables: {} },
    { headers: { "content-type": "application/json" } },
  );
  if (data.data.errors?.length) {
    throw new Error(data.data.errors[0].message);
  }
  return data.data.activeDailyCodingChallengeQuestion;
}

export async function createDailyMsg() {
  const db = getDB();
  const dailyProb = await getDaily();
  const link = "https://leetcode.com" + dailyProb.link;
  const msg =
    "**Title:** " +
    dailyProb.question.title +
    "\n**Difficulty:** " +
    dailyProb.question.difficulty +
    "\n**Link:** " +
    link;
  const [year, month, day] = dailyProb.date.split("-"); // YYYY-MM-DD
  const greeting = await getHoliday(month, day);
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
  const threadTitle =
    "LC Daily (" + intToMonth[month] + " " + day + "th " + year + ")";
  // by the time this function runs we will have already done the verification of who finished problems so we can add stuff easily
  db.today = dailyProb.date; // today: "YYYY-MM-DD"
  db.history[dailyProb.date] = {
    link: link,
    titleSlug: dailyProb.question.titleSlug,
    greeting: greeting,
    completedBy: {},
  };
  saveDB();
  return [greeting, msg, threadTitle];
}

// now For an array of usernames I want to send a request for each username to check if they completed the question
// I remember there was a command to see the most recent questions.
// curl 'https://leetcode.com/graphql' \
// -H 'content-type: application/json' \
// --data-raw '{
//   "query": "query recentAcSubmissions($username: String!, $limit: Int!) { recentAcSubmissionList(username: $username, limit: $limit) {titleSlug} }",
//   "variables": {"username": "apurvsinghdeo", "limit": 15}
// }'
export async function CompletedDaily(username, dailySlug) {
  const endpoint = "https://leetcode.com/graphql";
  const query = `query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
    titleSlug} }`;
  const { data } = await axios.post(
    endpoint,
    { query, variables: { username: username, limit: 15 } },
    { headers: { "content-type": "application/json" } },
  );
  const titles = data.data.recentAcSubmissionList;
  for (const t of titles) {
    const titleSlug = t["titleSlug"];
    if (titleSlug == dailySlug) {
      return true;
    }
  }
  return false;
}

// const tmp = await getDaily();
// console.log(tmp);
