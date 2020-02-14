# Storing Slack messages to Airtable base table

## Context

This example shows how to create a workflow that retrieves the latest messages from a Slack channel and stored their date, author and content in an Airtable table.

## Requirements

- A [Zenaton](https://zenaton.com/) account, API id and API key
- A [Slack](https://slack.com/) account with an app API key
- A [Airtable](https://airtable.com/) account with an API key and a table with this columns:
	- date (datetime)
	- from (string)
	- message (string)

## Workflow Logic

Step by step, the workflow logic is:
- Retrieve the last N messages from a Slack channel
- Retrieve the content of the Airtable table
- Saves all Slack messages not present in Airtable

## Dispatch

You can easily dipatch this workflow by using the [Zenaton graphql API](https://docs.zenaton.com/client/graphql-api):

```
curl --request POST \
  --url 'https://gateway.zenaton.com/graphql' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <api Token>' \
  --data '
  {
    "query": "mutation($input: DispatchWorkflowInput!) { dispatchWorkflow(input: $input) { id } }",
    "variables": {
      "input": {
        "appId": "<app id>",
        "environment": "<environment>",
        "name": "slackToAirtableWorkflow",
		"input": "[\"SLACK_CHANNEL\", \"30\", \"AIRTABLE_TABLE\", \"AIRTABLE_SHEET\"]"
      }
    }
  }'
```

You can too use the [Zenaton cron feature](https://docs.zenaton.com/client/graphql-api/#schedule-a-workflow) to dipatch this workflow every day at 2PM:

```
curl --request POST \
  --url 'https://gateway.zenaton.com/graphql' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <api Token>' \
  --data '
  {
    "query": "mutation($input: ScheduleWorkflowInput!) { scheduleWorkflow(input: $input) { id } }",
    "variables": {
      "input": {
        "appId": "<app id>",
        "environment": "<environment>",
		"cron": "0 2 * * *",
        "name": "slackToAirtableWorkflow",
		"input": "[\"SLACK_CHANNEL\", \"30\", \"AIRTABLE_TABLE\", \"AIRTABLE_SHEET\"]"
      }
    }
  }'
```

## Run on Heroku

Follow this button [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy), then fill in the env variables and click "deploy".
