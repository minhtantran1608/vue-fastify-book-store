<template>
  <div class="book-card group">
    <div class="relative w-full h-60 mb-2 object-contain flex justify-center">
      <img
        :src="'src/assets/book-' + book.id + '.jpg'"
        alt="car model"
        fill
        priority
        class="object-contain"
      />
    </div>
    <div class="book-card__content">
      <h2 class="book-card__content-title">
        {{ book.title }}
      </h2>
    </div>

    <p
      class="flex mt-2 text-[20px] leading-[20px] font-extrabold mx-auto text-blue-600"
    >
      <span class="self-start text-[14px] leading-[17px] font-semibold">$</span>
      {{ book.price }}
    </p>

    <div class="relative flex w-full mt-3">
      <div class="flex group-hover:invisible w-full justify-center text-grey">
        <div class="book-card__icon">
          <img src="../assets/author.svg" width="20" height="20" alt="author" />
          <p class="book-card__icon-text">{{ book.author }}</p>
        </div>
      </div>

      <div class="book-card__btn-container">
        <custom-button
          title="View More"
          author="F. Scott Fitzgerald"
          @handle-click="() => handleOpen(book.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomButton from "./CustomButton.vue";
defineProps(["book"]);
const emit = defineEmits(["handle-open"]);
const handleOpen = (id) => {
  emit("handle-open", id);
};
</script>
