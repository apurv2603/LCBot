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
        date link question {title difficulty }
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

// const tmp = await getDaily();
// console.log(tmp);
