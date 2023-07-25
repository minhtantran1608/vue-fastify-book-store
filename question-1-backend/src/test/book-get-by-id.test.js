const fastify = require("fastify");
const { routes } = require("../routes/book-route.js");

jest.mock("../elasticsearch/client.js", () => ({
  get: jest.fn().mockImplementation(({ id }) => {
    if (id === "existing_id") {
      return {
        found: true,
        _source: {
          title: "Existing Book",
          author: "Author",
          publishedDate: "2023-01-01",
          description: "Description",
          price: 10.0,
        },
      };
    } else {
      return { found: false };
    }
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

describe("Test /books/:id endpoint", () => {
  it("should return the book if it exists", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/books/existing_id",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    expect(JSON.parse(response.payload)).toEqual({
      title: "Existing Book",
      author: "Author",
      publishedDate: "2023-01-01",
      description: "Description",
      price: 10.0,
    });
  });

  it("should return 404 if the book does not exist", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/books/non_existing_id",
    });

    expect(response.statusCode).toBe(404);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    expect(JSON.parse(response.payload)).toEqual({ error: "Book not found" });
  });

  it("should return 500 if Elasticsearch get throws an error", async () => {
    const mockError = new Error("Elasticsearch error");
    require("../elasticsearch/client.js").get.mockRejectedValueOnce(mockError);

    const response = await server.inject({
      method: "GET",
      url: "/books/existing_id",
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
