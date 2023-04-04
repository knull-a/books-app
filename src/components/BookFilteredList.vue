<script setup lang="ts">
import { useBooksStore } from '@/stores/bookList';
import type { Book, SingleBook } from '@/types/book';
import axios from 'axios';
import { inject, onMounted, type Ref, watchEffect, isRef, watch, computed } from 'vue';
import BookCategoryList from './BookCategoryList.vue';
const bookList = useBooksStore()

const book = inject<Ref<SingleBook>>('book')

const hasAuthor = computed(() => book?.value.volumeInfo.authors !== undefined)

watchEffect(() => getBooks())

async function getBooks() {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${book?.value.volumeInfo.authors[0]}&key=${bookList.apiKey}`
        const response = await axios.get(url)
        bookList.books = response.data.items.map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || 'Unknown',
            imageLinks: item.volumeInfo.imageLinks || {},
        }))
    } catch (e) {
        console.log(e)
    }
}

</script>
<template>
    <div class="book__related related author" v-if="hasAuthor">
        <h3 class="related__title">More from {{ book?.volumeInfo.authors[0] }}</h3>
        <div class="related__books" v-for="authorBook in bookList.books">
            <div class="related__books-book">
                <img :src="authorBook.imageLinks.thumbnail" alt="Thumbnail" class="related__image">
                <div class="related__info">
                    <p class="related__title">{{ authorBook.title }}</p>
                    <p class="related__author">{{ authorBook.authors.toString().replace(/,/g, ", ") }}</p>
                </div>
            </div>
        </div>
    </div>
    <BookCategoryList />
</template>