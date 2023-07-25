<template>
  <button
    class="custom-btn w-full py-[16px] rounded-full bg-blue-600"
    type="button"
    @click="handleClick"
  >
    <span class="flex-1 text-white text-[14px] leading-[17px] font-bold">{{
      title
    }}</span>
    <div class="relative w-6 h-6">
      <img
        src="../assets/right-arrow.svg"
        alt="arrow_left"
        fill
        class="object-contain"
      />
    </div>
  </button>
</template>

<script setup>
const { title } = defineProps(["title"]);
const emit = defineEmits(["handle-click"]);

const handleClick = () => {
  emit("handle-click");
};
</script>
