import { mount } from "@vue/test-utils";
import Comment from "../src/components/Comment.vue";
import { expect } from "vitest";

const createWrapper = (propsData) => {
  return mount(Comment, {
    propsData,
  });
};

describe("Comment", () => {
  it("should render the comment content correctly", () => {
    const commentContent = "This is a comment";
    const wrapper = createWrapper({
      comment: {
        id: 1,
        content: commentContent,
        parentId: null,
      },
      replies: null,
    });

    expect(wrapper.text()).toContain(commentContent);
  });
});

describe("Comment", async () => {
  it("should allow editing the comment", async () => {
    const commentContent = "Initial comment";
    const editedComment = "Edited comment";

    const wrapper = createWrapper({
      comment: {
        id: 1,
        content: commentContent,
        parentId: null,
      },
      replies: null,
    });

    // Find the "Edit" span element
    const editButton = wrapper.find("span", { text: "Edit" });
    expect(editButton.exists()).toBe(true);
    // Simulate clicking the "Edit" span
    await editButton.trigger("click");

    // Check if the input field appears with the correct initial value
    const input = wrapper.find("input[placeholder='Edit comment...']");
    expect(input.exists()).toBe(true);
    expect(input.element.value).toBe(commentContent);

    // Set a new value in the input field
    await input.setValue(editedComment);

    // Check if the the "Save" button appears
    const saveButton = wrapper.find("button", { text: "Save" });
    expect(saveButton.exists()).toBe(true);
  });
});
