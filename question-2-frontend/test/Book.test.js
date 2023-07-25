import { mount } from "@vue/test-utils";
import Book from "../src/components/Book.vue";
import { expect } from "vitest";

describe("Book", () => {
  it("should render book details correctly", () => {
    const book = {
      title: "Sample Book",
      author: "John Doe",
      publishedDate: "2023-07-01",
      price: 19.99,
      description: "This is a sample book description.",
    };

    const wrapper = mount(Book, {
      propsData: {
        book,
        img: "sample-image-url",
        comments: [],
      },
    });

    expect(wrapper.find("h2").text()).toContain(book.title);
    expect(wrapper.findAll("p").at(0).text()).toContain(book.price);
    expect(wrapper.findAll("p").at(1).text()).toContain(book.author);
    expect(wrapper.findAll("p").at(1).text()).toContain(book.publishedDate);
    expect(wrapper.findAll("p").at(2).text()).toContain(book.description);
  });
});
