<template>
  <header-vue></header-vue>
  <div
    v-if="!loading"
    class="mt-12 mb-20 padding-x padding-y max-width"
    id="discover"
  >
    <div class="home__text-container">
      <h1 class="text-4xl font-extrabold">Books at My Store</h1>
      <p>Find your favorite author's livestream</p>
    </div>

    <div class="home__filters">
      <div class="home__filter-container"></div>
    </div>
    <section>
      <div class="home__books-wrapper">
        <book-card
          v-for="book in books"
          :key="book.id"
          :book="book"
          @handle-open="handleOpen"
        />
      </div>
    </section>
  </div>
  <div v-else class="flex justify-center items-center h-screen">
    <div class="loader">...Loading</div>
  </div>
  <modal v-if="chooseItem" @handle-close="handleClose">
    <book
      :book="chooseItem"
      :img="'src/assets/book-' + chooseItem.id + '.jpg'"
      :comments="bookComments(chooseItem.id)"
      @add-comment="addComment"
      @delete-comment="deleteComment"
      @edit-comment="editComment"
      @add-reply="addReply"
    />
  </modal>
  <footer-vue></footer-vue>
</template>

<script setup>
import axios from "axios";
import BookCard from "./components/BookCard.vue";
import Modal from "./components/Modal.vue";
import Book from "./components/Book.vue";
import HeaderVue from "./components/Header.vue";
import FooterVue from "./components/Footer.vue";
import { ref, onMounted } from "vue";

const books = ref([]);
const chooseItem = ref(null);
const loading = ref(false);

const comments = ref([]);

const loadBooks = async () => {
  try {
    loading.value = true;
    // const resp = await axios.get("books.json");
    const resp = await axios.get("http://localhost:3000/books");
    if (resp.status === 200) {
      books.value = resp.data;
    }
  } catch (error) {
    console.log(error.response.data.error);
  } finally {
    loading.value = false;
  }
};

const loadComments = async () => {
  try {
    const resp = await axios.get("comments.json");
    if (resp.status === 200) {
      comments.value = resp.data;
    }
  } catch (error) {
    console.log(error.response.data.error);
  }
};

const bookComments = (id) => {
  return comments.value.filter((comment) => comment.postId === id);
};

const addComment = (content) => {
  comments.value.push({
    postId: chooseItem.value.id,
    id: `${Math.floor(Math.random() * 10000)}`,
    content,
  });
};

const editComment = ({ id, content }) => {
  console.log(id, content);
  comments.value = comments.value.map((comment) => {
    if (comment.id === id) {
      return {
        ...comment,
        content,
      };
    }
    return comment;
  });
};

const deleteComment = (id) => {
  comments.value = comments.value.filter((comment) => comment.id !== id);
};

const addReply = ({ parentId, content }) => {
  comments.value.push({
    postId: chooseItem.value.id,
    id: `${Math.floor(Math.random() * 10000)}`,
    content,
    parentId,
  });
};

onMounted(() => {
  loadBooks();
  loadComments();
});

const handleOpen = async (id) => {
  try {
    const resp = await axios.get(`http://localhost:3000/books/${id}`);
    if (resp.status === 200) {
      chooseItem.value = resp.data;
    }
  } catch (error) {
    console.log(error.response.data.error);
  }
  // chooseItem.value = books.value.find((book) => book.id === id);
};

const handleClose = () => {
  chooseItem.value = null;
};
</script>
