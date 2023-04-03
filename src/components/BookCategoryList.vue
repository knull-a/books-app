<script setup lang="ts">
import { useBooksStore } from '@/stores/bookList';
import axios from 'axios';
import { onMounted } from 'vue';
const bookList = useBooksStore()

const props = defineProps<{
  book: any
}>()
onMounted(async () => {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=+subject:${props.book?.volumeInfo.categories[0]}&key=${bookList.apiKey}`
        const response = await axios.get(url)
        bookList.books = response.data.items.map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || 'Unknown',
            imageLinks: item.volumeInfo.imageLinks || {},
        }))
        console.log(url)    
    } catch(error) {
        console.error(error)
    }
})
</script>
<template>
<div class="book__related related author">
    <h3 class="related__title">More {{ book?.volumeInfo.categories[0] }}</h3>
    <div class="related__books" v-for="categoryBook in bookList.books">
        <div class="related__books-book">
            <img :src="categoryBook.imageLinks.thumbnail" alt="Thumbnail" class="related__image">
            <div class="related__info">
                <p class="related__title">{{ categoryBook.title }}</p>
                <p class="related__author">{{ categoryBook.authors.toString().replace(/,/g, ", ") }}</p>
            </div>
        </div>
    </div>
</div>
</template>