<script setup lang="ts">
import { ref } from 'vue';

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

const books = ref<Book[]>([])

</script>

<template>
    <div v-for="book in books" :key="book.id">
        {{ book.title }}
        <img :src="book.imageLinks.thumbnail" alt="">
    </div>
</template>