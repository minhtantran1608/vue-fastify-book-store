<template>
  <form
    @submit="addComment"
    class=""
    :class="isReply ? 'ml-6 mb-4 pr-2 relative comment-replies' : ''"
  >
    <div class="flex gap-2" :class="isReply ? 'reply' : ''">
      <input
        v-model="comment"
        class="bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg"
        :placeholder="!isReply ? 'Add comment...' : 'Add Reply...'"
      />
      <button
        class="text-md rounded-lg px-4"
        :class="
          isPostingComment || !comment
            ? 'text-gray-400 bg-gray-200'
            : 'bg-blue-600 text-white'
        "
        :disabled="isPostingComment || !comment"
        @click="addComment"
        type="submit"
      >
        {{
          isPostingComment
            ? `${isReply ? "Reply" : "Comment"}ing...`
            : `${isReply ? "Reply" : "Comment"}`
        }}
      </button>
    </div>
  </form>
</template>
<script setup>
import { ref } from "vue";
const comment = ref("");
const isPostingComment = ref(false);

const { isReply } = defineProps(["is-reply"]);
const emit = defineEmits(["add-comment"]);
const addComment = (e) => {
  e.preventDefault();
  isPostingComment.value = true;
  emit("add-comment", comment.value);
  comment.value = "";
  isPostingComment.value = false;
};
</script>
