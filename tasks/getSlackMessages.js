const axios = require("axios");

const { SLACK_API_KEY } = process.env;

module.exports.handle = async function(channel) {
  const response = await axios.get(
    `https://slack.com/api/conversations.history?token=${SLACK_API_KEY}&channel=${channel}&limit=10`
  );
  return response.data.messages;
};
