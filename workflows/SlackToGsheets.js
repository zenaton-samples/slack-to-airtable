const slackConnectorId = "";
const googlesheetsConnectorId = "";

module.exports.handle = function*({channelToSource, channelToNotify, spreadsheetId}) {
  const slack = this.connector("slack", slackConnectorId);
  const google_sheets = this.connector("google_sheets", googlesheetsConnectorId);

  // Extract historical messages from a slack channel
  const history = (yield slack.get("channels.history", {
    query: {
      channel: channelToSource
    }
  })).data;

  const range = "sheet1!A:D";

  // Transform data to fit GoogleSheet format
  const cells = history.messages.map(x => [x.user, x.text]);

  // Append data in a GoogleSheet
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

  // Send a private Slack message when it's done
  yield slack.post("chat.postMessage", {
    body: {
      text: "Done",
      as_user: false,
      channel: channelToNotify
    }
  });
};
