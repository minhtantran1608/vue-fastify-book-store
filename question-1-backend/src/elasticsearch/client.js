const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: process.env.ELASTICSEARCH_URI,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY,
    id: "books",
  },
});

module.exports = client;
