const axios = require("axios");

const { AIRTABLE_KEY } = process.env;

module.exports.handle = async function(baseId, tableName, messages) {
  
  // get current records in Airtable
  const currentRecords = await axios.get(
    `https://api.airtable.com/v0/${baseId}/${tableName}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_KEY}`
      }
    }
  );

  // remove records already stored in Airtable
  const newRecords = messages
    .map(message => {
      return {
        fields: {
          date: new Date(message.ts * 1000),
          from: message.username ? message.username : message.user,
          message: message.text
        }
      };
    })
    .filter(message => {
      return (
        currentRecords.data.records.filter(record => {
          return record.fields.message === message.fields.message;
        }).length === 0
      );
    });

  // create chunks of 10 records because of Airtable API limitation
  const newRecordsChunk = [];
  while (newRecords.length > 0) {
    newRecordsChunk.push(newRecords.splice(0, 10));
  }

  // store in Airtable
  newRecordsChunk.forEach(chunkRecords => {
    axios.post(
      `https://api.airtable.com/v0/${baseId}/${tableName}`,
      {
        records: chunkRecords
      },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_KEY}`
        }
      }
    );
  });
};
