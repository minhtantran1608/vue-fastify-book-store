<template>
  <div
    class="p-2 flex items-center border-solid border-2 rounded-xl mb-1 mr-2"
    :class="comment.parentId ? 'reply' : ''"
  >
    <div class="w-10 h-10 mr-2">
      <img
        width="40"
        height="40"
        class="rounded-full"
        src="../assets/profile.svg"
        alt="user-profile"
        layout="responsive"
      />
    </div>
    <div class="flex-1">
      <p v-if="!isEditing" class="text-[14px] mr-8">
        {{ comment.content }}
      </p>
      <div v-else class="flex gap-2">
        <input
          v-model="editedComment"
          class="bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg"
          placeholder="Edit comment..."
          @keyup.enter="editComment(comment.id)"
        />
        <button
          class="text-md rounded-lg px-4"
          :class="
            isPostingComment || !editedComment
              ? 'text-gray-400 bg-gray-200'
              : 'bg-blue-600 text-white'
          "
          :disabled="isPostingComment || !editedComment"
          @click="editComment(comment.id)"
          type="button"
        >
          {{ isPostingComment ? "Saving..." : "Save" }}
        </button>
      </div>
    </div>
  </div>
  <div class="mb-2">
    <span
      class="inline-block cursor-pointer font-bold text-sm mr-4"
      @click="setEditting"
      >{{ !isEditing ? "Edit" : "Cancel" }}</span
    >
    <span
      v-if="!comment.parentId"
      class="inline-block cursor-pointer font-bold text-sm mr-4"
      @click="setReplying"
      >{{ !isReplying ? "Reply" : "Cancel" }}</span
    >
    <span
      @click="deleteComment(comment.id)"
      class="inline-block cursor-pointer font-bold text-sm"
      >Delete</span
    >
  </div>

  <reply-form v-if="isReplying" @add-comment="addReply" :is-reply="true" />

  <div v-if="replies" class="ml-6 relative comment-replies">
    <comment
      v-for="reply in replies"
      :key="reply.id"
      :comment="reply"
      @delete-comment="deleteComment"
      @edit-comment="editComment"
    />
  </div>
</template>
<script>
export default {
  name: "Comment",
};
</script>
<script setup>
import { ref } from "vue";
import ReplyForm from "./CommentForm.vue";
const { comment, replies } = defineProps(["comment", "replies"]);
const emit = defineEmits(["delete-comment", "edit-comment", "add-reply"]);

const isEditing = ref(false);
const isPostingComment = ref(false);
const isReplying = ref(false);

const editedComment = ref(comment.content);

const setEditting = () => {
  isEditing.value = !isEditing.value;
  // editedComment.value = comment.content;
};

const setReplying = () => {
  isReplying.value = !isReplying.value;
};

const editComment = (id) => {
  console.log(id);
  isPostingComment.value = true;
  if (typeof id === "object")
    emit("edit-comment", {
      ...id,
    });
  else
    emit("edit-comment", {
      content: editedComment.value,
      id,
    });
  isEditing.value = false;
  isPostingComment.value = false;
};

const deleteComment = (id) => {
  emit("delete-comment", id);
};

const addReply = (value) => {
  emit("add-reply", {
    content: value,
    parentId: comment.id,
  });
  isReplying.value = false;
};
</script>
