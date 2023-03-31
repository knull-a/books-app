<script setup lang="ts">
// AIzaSyCayVRubdihrXqBykrVwZ_NuuN4IU4-gGI
import axios from 'axios';
import { ref, watchEffect, defineComponent, provide } from 'vue';
import { RouterLink } from 'vue-router';
interface Book {
    id: string;
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    pageCount: number;
    categories: string[];
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    previewLink: string;
}

const loading = ref(false)

const books = ref<Book[]>([])

provide("books", books)

const searchQuery = ref("")

async function getBooks() {
  try {
    loading.value = true
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery.value}`;
    const response = await axios.get(url);
    books.value = response.data.items.map((item: any) => ({
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
  catch(e) {
    console.error(e)
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
    
    <RouterLink to="/" v-else="loading = false" v-for="book in books" :key="book.id">
      {{ book.title }}
      <img :src="book.imageLinks.thumbnail" alt="">
    </RouterLink>
  </div>
</div>
</template>