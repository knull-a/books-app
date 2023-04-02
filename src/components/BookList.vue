<script setup lang="ts">
import { ref } from 'vue';
import {useBooksStore} from '@/stores/bookList'

const bookList = useBooksStore()

</script>

<template>
    <div v-for="book in bookList.books" :key="book.id">
        {{ book.title }}
        <img :src="book.imageLinks.thumbnail" alt="">
    </div>
</template>