const client = require("../elasticsearch/client.js");
const Book = require("../schema/book.js");

// Helper function to populate Elasticsearch index from MongoDB data
async function populateElasticsearchIndex() {
  try {
    const indexExists = await client.indices.exists({ index: "books" });

    if (indexExists === true) {
      await client.indices.delete({ index: "books" });
    }

    const books = await Book.find();

    if (books.length === 0) {
      console.log("No data to import into Elasticsearch.");
      return;
    }

    const batchSize = 1000;
    let startIndex = 0;

    while (startIndex < books.length) {
      const endIndex = Math.min(startIndex + batchSize, books.length);
      const batchData = books.slice(startIndex, endIndex);

      const bulkData = batchData.flatMap((book) => [
        { index: { _index: "books", _id: book._id.toString() } },
        {
          id: book._id.toString(),
          title: book.title,
          author: book.author,
          publishedDate: book.publishedDate,
          description: book.description,
          price: book.price,
        },
      ]);

      await client.bulk({ refresh: true, body: bulkData });

      startIndex = endIndex;
    }

    console.log("Books data imported successfully.");
  } catch (err) {
    console.error("Error importing books data:", err);
    process.exit(1);
  }
}

module.exports = populateElasticsearchIndex;
