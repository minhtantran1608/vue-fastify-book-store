<template>
  <div class="flex-1 flex gap-6 w-[800px]">
    <div class="relative bg-pattern bg-cover bg-center rounded-lg">
      <img :src="img" alt="book image" fill priority class="object-contain" />
    </div>
    <div class="flex-1 flex flex-col gap-3">
      <p
        class="flex mt-2 text-[20px] leading-[20px] font-extrabold text-blue-600"
      >
        <span class="self-start text-[14px] leading-[17px] font-semibold"
          >$</span
        >
        {{ book.price }}
      </p>
      <h2 class="text-[20px] italic">{{ book.title }}</h2>
      <p class="text-[#717171]">
        By: {{ book.author }} &nbsp; | &nbsp; Published Date:
        {{ book.publishedDate }}
      </p>
      <p class="text-sm font-normal">{{ book.description }}</p>
      <div
        class="border-t-2 border-gray-200 pt-2 pl-2 mt-4 bg-[#F8F8F8] border-b-2 lg:pb-0 pb-[100px] overflow-y-scroll lg:h-[280px] scrollbar"
      >
        <comment
          v-if="getComments.length > 0"
          v-for="comment in getComments"
          :key="comment.id"
          :comment="comment"
          :replies="getReplyComments(comment.id)"
          @edit-comment="editComment"
          @delete-comment="deleteComment"
          @add-reply="addReply"
        />
        <no-comments
          v-else
          text="No Comments Yet! Be First to do add the comment."
        />
      </div>
      <comment-form @add-comment="addComment" />
    </div>
  </div>
</template>
<script setup>
import Comment from "./Comment.vue";
import CommentForm from "./CommentForm.vue";
import NoComments from "./NoComments.vue";
import { ref, watch, computed } from "vue";
const props = defineProps(["book", "img", "comments"]);
const emits = defineEmits([
  "add-comment",
  "delete-comment",
  "edit-comment",
  "add-reply",
]);

const comments = ref(props.comments);

const getComments = computed(() => {
  return comments.value.filter((comment) => !comment.parentId);
});

watch(
  () => props.comments,
  (newVal) => {
    comments.value = newVal;
  }
);

const getReplyComments = (id) => {
  return comments.value.filter((comment) => comment.parentId === id);
};

const addComment = (content) => {
  emits("add-comment", content);
};

const editComment = ({ id, content }) => {
  emits("edit-comment", { id, content });
};

const deleteComment = (id) => {
  emits("delete-comment", id);
};

const addReply = ({ parentId, content }) => {
  emits("add-reply", { parentId, content });
};
</script>
