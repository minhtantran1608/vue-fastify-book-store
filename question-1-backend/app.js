require("dotenv").config();
const fastify = require("fastify");
const { connectToDB } = require("./src/utils/db.js");
const { routes } = require("./src/routes/book-route.js");
const populateElasticsearchIndex = require("./src/utils/populate.js");

const server = fastify();

server.register(routes);

// Start the server after connecting to the MongoDB and populating Elasticsearch index
async function startServer() {
  try {
    await connectToDB();

    // Read books data from MongoDB and populate Elasticsearch index
    await populateElasticsearchIndex();

    await server.listen({ port: 3000 });
    console.log("Server listening on http://localhost:3000");
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

startServer();
