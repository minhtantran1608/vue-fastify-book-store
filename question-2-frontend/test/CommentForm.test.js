import { mount } from "@vue/test-utils";
import CommentForm from "../src/components/CommentForm.vue";
import { expect } from "vitest";

describe("CommentForm", () => {
  it("should add a comment when the form is submitted", async () => {
    const isReply = false;
    const wrapper = mount(CommentForm, {
      props: {
        isReply,
      },
    });

    // Find the input field and set its value
    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    await input.setValue("Test comment");

    // Find the form element and trigger the submit event
    const form = wrapper.find("form");
    expect(form.exists()).toBe(true);
    await form.trigger("submit");

    // Check if the add-comment event was emitted with the correct comment value
    expect(wrapper.emitted("add-comment")).toHaveLength(1);
    expect(wrapper.emitted("add-comment")[0][0]).toBe("Test comment");

    // Check if the input field is cleared after submitting the form
    expect(input.element.value).toBe("");
  });
});
