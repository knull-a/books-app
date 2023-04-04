<script setup lang="ts">
import { useBooksStore } from '@/stores/bookList';
import axios from 'axios';
import { computed, inject, onMounted, ref, watchEffect, type Ref } from 'vue';
import type { Book, SingleBook } from '@/types/book';
const bookList = useBooksStore()
const books = ref<Book[]>([])
const book = inject<Ref<SingleBook>>('book')

const hasCategory = computed(() => book?.value.volumeInfo.authors !== undefined)

watchEffect(() => getBooks())

async function getBooks() {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=+subject:${book?.value.volumeInfo.categories[0]}&key=${bookList.apiKey}`
        const response = await axios.get(url)
        books.value = response.data.items.map((item: any) => ({
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
    <div class="book__related related category" v-if="hasCategory">
        <h3 class="related__title">More {{ book?.volumeInfo.categories[0] }}</h3>
        <div class="related__books" v-for="categoryBook in books">
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