const client = require("../elasticsearch/client.js");
const Book = require("../schema/book.js");

function handleElasticsearchError(err, reply) {
  // console.error(err);
  console.log(err);
  if (err?.meta?.statusCode === 404) {
    reply.code(404).send({ error: "Not found" });
  }
  reply.code(500).send({ error: "Internal Server Error" });
}

function handleValidateRequest(req, reply) {
  const { title, author, publishedDate, description, price } = req.body;
  if (!title || !author || !publishedDate || !description || !price) {
    reply.code(400).send({ error: "All fields are required" });
    return;
  }

  if (
    typeof title !== "string" ||
    typeof author !== "string" ||
    typeof publishedDate !== "string" ||
    typeof description !== "string" ||
    typeof price !== "number"
  ) {
    reply.code(400).send({ error: "Invalid data types for fields" });
    return;
  }
}

async function routes(server) {
  server.addHook("onRequest", (request, reply, done) => {
    reply.header("Access-Control-Allow-Origin", "*");
    done();
  });

  server.get("/books", async (request, reply) => {
    try {
      const res = await client.search({
        index: "books",
        size: 10000,
        body: { query: { match_all: {} } },
      });
      reply.send(res.hits.hits.map((hit) => hit._source));
    } catch (err) {
      handleElasticsearchError(err, reply);
    }
  });

  // Returns a specific book by ID
  server.get("/books/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const res = await client.get({ index: "books", id });
      if (!res.found) {
        reply.code(404).send({ error: "Book not found" });
      } else {
        reply.send(res._source);
      }
    } catch (err) {
      handleElasticsearchError(err, reply);
    }
  });

  // Create a new book
  server.post("/books", async (request, reply) => {
    try {
      handleValidateRequest(request, reply);
      const { title, author, publishedDate, description, price } = request.body;

      // Create a new book document in MongoDB
      const newBook = new Book({
        title,
        author,
        publishedDate,
        description,
        price,
      });

      // Save the new book to MongoDB
      await newBook.save();

      await client.index({
        index: "books",
        id: newBook._id.toString(),
        body: {
          id: newBook._id.toString(),
          title: newBook.title,
          author: newBook.author,
          publishedDate: newBook.publishedDate,
          description: newBook.description,
          price: newBook.price,
        },
        // refresh: "wait_for",
      });
      // Index the new book in Elasticsearch
      // await populateElasticsearchIndex();
      reply.code(201).send({
        message: "Book added successfully",
        id: newBook._id.toString(),
      });
    } catch (err) {
      handleElasticsearchError(err, reply);
    }
  });

  // Update an existing book by ID
  server.put("/books/:id", async (request, reply) => {
    try {
      handleValidateRequest(request, reply);
      const { id } = request.params;
      const { title, author, publishedDate, description, price } = request.body;

      // Find the book by ID in MongoDB
      const existingBook = await Book.findByIdAndUpdate(
        id,
        {
          title,
          author,
          publishedDate,
          description,
          price,
        },
        { new: true }
      );

      if (!existingBook) {
        reply.code(404).send({ error: "Book not found" });
        return;
      }

      // Update the book in Elasticsearch
      await client.index({
        index: "books",
        id: existingBook._id.toString(),
        document: {
          id: existingBook._id.toString(),
          title: existingBook.title,
          author: existingBook.author,
          publishedDate: existingBook.publishedDate,
          description: existingBook.description,
          price: existingBook.price,
        },
        // refresh: "wait_for",
      });

      reply.send({ message: "Book updated successfully" });
    } catch (err) {
      handleElasticsearchError(err, reply);
    }
  });
}

module.exports = { routes, handleValidateRequest };
