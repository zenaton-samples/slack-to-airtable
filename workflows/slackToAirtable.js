module.exports.handle = function*(channelToSource, numberOfMessages, airtableBaseId, tableName) {
  // get last 10 messages from Slack channel
  const messages = yield this.run.task("getSlackMessages", channelToSource, numberOfMessages);
  
  // store messages in an Airtable base table
  const response = yield this.run.task("storeInAirtable", airtableBaseId, tableName, messages);
};
