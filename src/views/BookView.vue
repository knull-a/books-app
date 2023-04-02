<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useBooksStore } from '@/stores/bookList';
import type { Book } from '@/types/book';
import axios from 'axios';
const route = useRoute()
const bookList = useBooksStore()

const book = ref()

console.log(route.params.id)


onMounted(async () => {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes/${route.params.id}?projection=full&key=${bookList.apiKey}`
        const response = await axios.get(url)
        book.value = response.data
    } catch(error) {
        console.error(error)
    }
})

    

</script>
<template>
<div class="book">
    <div class="book__side">
        <img :src="book?.volumeInfo.imageLinks.thumbnail" alt="Thumbnail" class="book__image">
        <button class="btn btn-primary book__btn">Want to read</button>
        <button v-show="book?.saleInfo.saleability === 'FOR_SALE'" class="btn btn-primary book__btn">Buy {{ Math.floor(book?.saleInfo.listPrice.amount) + book?.saleInfo.listPrice.currencyCode }}</button>
    </div>
    <div class="book__main">
        <h3 class="book__title">{{ book?.volumeInfo.title }}</h3>
        
    </div>
</div>

</template>
