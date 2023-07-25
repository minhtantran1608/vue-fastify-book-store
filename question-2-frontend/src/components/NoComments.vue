<template>
  <div class="flex flex-col justify-center items-center h-full w-full">
    <p class="text-2xl">
      <img
        src="../assets/no-comments.svg"
        width="50"
        height="50"
        alt="no comments"
      />
    </p>
    <p class="text-sm text-center">{{ text }}</p>
  </div>
</template>
<script setup>
defineProps(["text"]);
</script>
