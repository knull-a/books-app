<script setup lang="ts">
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useBooksStore } from '@/stores/bookList';
import { useStarRating } from '@/composables/starRating';
import SearchComponent from '@/components/SearchComponent.vue';
import type { SingleBook, Book } from "@/types/book";

const bookList = useBooksStore()

const isLoading = ref(false)

const isLoaded = ref(false)

const searchQuery = ref("")

const hasData = ref(false)

const totalBooks = ref(0)

const order = ref('relevance')

const comments = ref<Book[]>([]);
const page = ref(10);

async function getBooks(state?: any) { // v3-infinite-loading
    try {
        if (searchQuery.value === '') return
        [isLoading.value, hasData.value] = [true, true]
        const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery.value}&orderBy=${order.value}&startIndex=0&maxResults=${page.value}&key=${bookList.apiKey}`;
        const response = await axios.get(url);
        totalBooks.value = response.data.totalItems
        bookList.books = response.data.items.map((item: SingleBook) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || 'Unknown',
            publisher: item.volumeInfo.publisher,
            publishedDate: item.volumeInfo.publishedDate,
            description: item.volumeInfo.description || '',
            pageCount: item.volumeInfo.pageCount || 0,
            categories: item.volumeInfo.categories || [],
            imageLinks: item.volumeInfo.imageLinks || {},
            averageRating: item.volumeInfo.averageRating || '0',
            saleInfo: item.saleInfo
        }))

        if (bookList.books.length >= 40) state.complete();
        else {
            comments.value.push(...bookList.books)
            state.loaded()
        }
        page.value+=3
    }
    catch (err) {
        console.error(err)
    }
    finally {
        isLoading.value = false
        isLoaded.value = true
    }
}

</script>

<template>
    <v-container class="fill-height">
        <v-row class="d-flex" no-gutters>
            <v-col class="text-center" cols="12" justify-self="center">
                <h1>Find any book you want!</h1>
            </v-col>
            <v-col cols="3">
                <v-select v-model="order" density="comfortable" label="Sort by" variant="solo"
                    :items="['relevance', 'newest']"></v-select>
            </v-col>
            <v-col cols="9">
                <v-text-field append-inner-icon="fas fa-search" variant="solo" density="comfortable" v-if="!isLoading"
                    type="text" v-model="searchQuery" @keypress.enter="getBooks()"
                    @click:append-inner="getBooks()"></v-text-field>
                <v-text-field append-inner-icon="fas fa-search" variant="solo" density="comfortable" color="success" loading
                    disabled v-else type="text" v-model="searchQuery" @keypress.enter="getBooks()"
                    @click:append-inner="getBooks()"></v-text-field>
            </v-col>

            <div v-if="isLoaded">
                <SearchComponent :bookList="bookList" />
                <InfiniteLoading @infinite="getBooks" />
            </div>

        </v-row>
    </v-container>
</template>