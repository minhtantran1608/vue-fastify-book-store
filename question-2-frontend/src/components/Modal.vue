<template>
  <teleport to="body">
    <div
      class="fixed top-0 left-0 w-full h-[100vh] z-50 bg-black opacity-75"
      @click="closeModal"
    ></div>
    ;
    <div
      class="fixed left-1/2 top-[11%] transform -translate-x-1/2 z-50 animate-slide-down"
    >
      <div
        class="relative w-full max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col gap-5 opacity-100 scale-100"
      >
        <button
          type="button"
          class="absolute top-2 right-2 z-10 w-fit p-2 bg-[#F5F8FF] rounded-full"
          @click="closeModal"
        >
          <img
            src="../assets/close.svg"
            alt="close"
            width="20"
            height="20"
            class="object-contain"
          />
        </button>
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>
<script setup>
const emit = defineEmits(["handle-close"]);
const closeModal = () => {
  emit("handle-close");
};
</script>
