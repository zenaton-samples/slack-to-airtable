// load dependencies
const { workflow, task } = require("zenaton");
require('dotenv').config()

// define workflows
workflow(
  "slackToAirtableWorkflow",
  require("./workflows/slackToAirtable")
);

// define tasks
task("getSlackMessages", require("./tasks/getSlackMessages"));
task("storeInAirtable", require("./tasks/storeInAirtable"));
