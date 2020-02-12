const axios = require("axios");

const { AIRTABLE_KEY } = process.env;

module.exports.handle = async function(baseId, tableName, messages) {

  const records = messages.map(message => {
    return {
      "fields": {
        "from": message.username ? message.username : message.user,
        "message": message.text
      }
    };
  });

  const response = await axios.post(
    `https://api.airtable.com/v0/${baseId}/${tableName}`,
    {
      "records": records
    },
    {
      'headers': {
        'Authorization': `Bearer ${AIRTABLE_KEY}`
      }
    }
  );
  return response.data;
};
