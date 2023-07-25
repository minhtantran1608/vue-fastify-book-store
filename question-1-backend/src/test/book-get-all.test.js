const fastify = require("fastify");
const { routes, handleValidateRequest } = require("../routes/book-route.js");

jest.mock("../elasticsearch/client.js", () => ({
  search: jest.fn().mockResolvedValue({
    hits: {
      hits: [
        {
          _source: {
            title: "Book 1",
            author: "Author 1",
            publishedDate: "2023-01-01",
            description: "Description 1",
            price: 10.0,
          },
        },
        {
          _source: {
            title: "Book 2",
            author: "Author 2",
            publishedDate: "2023-02-01",
            description: "Description 2",
            price: 20.0,
          },
        },
      ],
    },
  }),
}));

let server;

beforeAll(async () => {
  server = fastify();
  await server.register(routes);
});

afterAll(async () => {
  await server.close();
});

describe("Test /books endpoint", () => {
  it("should return an array of books", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/books",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    expect(JSON.parse(response.payload)).toEqual([
      {
        title: "Book 1",
        author: "Author 1",
        publishedDate: "2023-01-01",
        description: "Description 1",
        price: 10.0,
      },
      {
        title: "Book 2",
        author: "Author 2",
        publishedDate: "2023-02-01",
        description: "Description 2",
        price: 20.0,
      },
    ]);
  });

  it("should return 500 if Elasticsearch search fails", async () => {
    const mockError = new Error("Elasticsearch error");
    require("../elasticsearch/client.js").search.mockRejectedValueOnce(
      mockError
    );

    const response = await server.inject({
      method: "GET",
      url: "/books",
    });

    expect(response.statusCode).toBe(500);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    expect(JSON.parse(response.payload)).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Test handleValidateRequest function", () => {
  it("should pass with valid data", async () => {
    const req = {
      body: {
        title: "Book Title",
        author: "Author Name",
        publishedDate: "2023-07-23",
        description: "Description of the book",
        price: 15.99,
      },
    };

    const reply = {
      code: jest.fn(() => reply),
      send: jest.fn(),
    };

    handleValidateRequest(req, reply);

    expect(reply.code).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
  });

  it("should return 400 with invalid data", async () => {
    const req = {
      body: {
        title: 123, // Invalid data type
        author: "Author Name",
        publishedDate: "2023-07-23",
        description: "Description of the book",
        price: "15.99", // Invalid data type
      },
    };

    const reply = {
      code: jest.fn(() => reply),
      send: jest.fn(),
    };

    handleValidateRequest(req, reply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      error: "Invalid data types for fields",
    });
  });
});
