//need a function to authenticate LC username
import axios from "axios";

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
export async function getDaily() {
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
