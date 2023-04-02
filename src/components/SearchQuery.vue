<script setup lang="ts">
// AIzaSyCayVRubdihrXqBykrVwZ_NuuN4IU4-gGI
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useBooksStore } from '@/stores/bookList';
import type { Book } from '@/types/book';

const router = useRouter()
const bookList = useBooksStore()

const loading = ref(false)

const searchQuery = ref("")

const openBookView = (bookId: string) => {
  router.push({name: 'Book', params: {id: bookId}})
}

async function getBooks() {
  try {
    loading.value = true
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery.value}&key=${bookList.apiKey}`;
    const response = await axios.get(url);
    bookList.books = response.data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      publisher: item.volumeInfo.publisher,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description || '',
      pageCount: item.volumeInfo.pageCount || 0,
      categories: item.volumeInfo.categories || [],
      imageLinks: item.volumeInfo.imageLinks || {},
      previewLink: item.volumeInfo.previewLink,

    }));
    console.log(searchQuery.value, url)
  }
  catch(err) {
    console.error(err)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
<div class="search">
  <input
   type="text"
   v-model="searchQuery"
   @keypress.enter="getBooks"
  >
  <button @click="getBooks">Search</button>
  <div class="search__list">
    <div v-if="loading">Loading...</div>

    
    <RouterLink :to="{name: 'Book', params: {id: book.id}}" v-else="loading = false" v-for="book in bookList.books" :key="book.id">
      {{ book.id }}
      <img :src="book.imageLinks.thumbnail" alt="">
    </RouterLink>
  </div>
</div>
</template>