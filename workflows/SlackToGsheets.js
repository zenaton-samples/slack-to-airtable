const slackConnectorId = "<ENTER_YOUR_ZENATON_SLACK_CONNECTOR_ID>";
const googlesheetsConnectorId = "<ENTER_YOUR_ZENATON_GOOGLE_SHEETS_CONNECTOR_ID>";

module.exports.handle = function*({channelToSource, channelToNotify, spreadsheetId}) {
  const slack = this.connector("slack", slackConnectorId);
  const google_sheets = this.connector("google_sheets", googlesheetsConnectorId);

  // Extract messages from a slack channel
  const history = (yield slack.get("channels.history", {
    query: {
      channel: channelToSource
    }
  })).data;

  const range = "sheet1!A:D";

  // Transform data to match GoogleSheet format
  const cells = history.messages.map(x => [x.user, x.text]);

  // Append data to a GoogleSheet
  yield google_sheets.post(
    `/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`,
    {
      body: {
        range: range,
        majorDimension: "ROWS",
        values: cells
      }
    }
  );

  // Send a Slack message to the destination channel
  yield slack.post("chat.postMessage", {
    body: {
      text: "Done",
      as_user: false,
      channel: channelToNotify
    }
  });
};
