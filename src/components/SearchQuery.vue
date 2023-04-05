<script setup lang="ts">
// AIzaSyCayVRubdihrXqBykrVwZ_NuuN4IU4-gGI
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useBooksStore } from '@/stores/bookList';
import { useStarRating } from '@/composables/starRating';

const bookList = useBooksStore()

const isLoading = ref(false)

const isLoaded = ref(false)

const searchQuery = ref("")

const page = ref(0)

const hasData = ref(false)

const totalBooks = ref(0)

const previousPage = () => {
    if (page.value === 0) return
    getBooks(10, page.value -= 10)
}
const nextPage = () => {
    getBooks(10, page.value += 10)
}

const order = ref('relevance')

async function getBooks(limit?: number, skip?: number) {
    try {
        if (searchQuery.value === '') return
        [isLoading.value, hasData.value] = [true, true]
        const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery.value}&orderBy=${order.value}&startIndex=${skip || 0}&maxResults=${limit || 40}&key=${bookList.apiKey}`;
        console.log(url)
        const response = await axios.get(url);
        totalBooks.value = response.data.totalItems
        bookList.books = response.data.items.map((item: any) => ({
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
            saleInfo: item.saleInfo,
            downloadEpub: item.accessInfo.epub,
            downloadPdf: item.accessInfo.pdf
        }))
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
            <v-col cols="12" justify-self="center">
                <h1>Find any book you want!</h1>
            </v-col>
            <v-col cols="2">
                <v-select v-model="order" density="comfortable" label="Sort by" variant="solo"
                    :items="['relevance', 'newest']"></v-select>
            </v-col>
            <v-col cols="10">
                <v-text-field append-inner-icon="fas fa-search" variant="solo" density="comfortable" v-if="!isLoading"
                    type="text" v-model="searchQuery" @keypress.enter="getBooks()"
                    @click:append-inner="getBooks()"></v-text-field>
                <v-text-field append-inner-icon="fas fa-search" variant="solo" density="comfortable" color="success" loading
                    disabled v-else type="text" v-model="searchQuery" @keypress.enter="getBooks()"
                    @click:append-inner="getBooks()"></v-text-field>
            </v-col>

            <div v-if="isLoaded">
                <v-col class="d-flex flex-column" cols="6">
                    <RouterLink class="d-inline-flex my-2" :to="{ name: 'Book', params: { id: book.id } }"
                        v-for="book in bookList.books" :key="book.id">
                        <v-img class="mx-auto" width="130" height="200" cover :src="book.imageLinks.thumbnail">
                            <template v-slot:placeholder>
                                <div class="d-flex align-center justify-center fill-height">
                                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                </div>
                            </template>
                        </v-img>
                        <v-col cols="12" class="book__main">
                            <h3 class="text-h5">{{ book.title }}</h3>
                            <p class="text-subtitle-1">By {{ book.authors.toString().replace(/,/g, ", ") }}</p>
                            <p class="text-h6">{{ useStarRating(parseInt(book.averageRating)) || "☆☆☆☆☆" }} {{
                                book.averageRating }}</p>
                        </v-col>
                    </RouterLink>
                </v-col>
                <v-col cols="12">
                    <div class="search__pagination">
                        <button @click="previousPage">
                            {{ "<" }} </button>
                                <button @click="nextPage">
                                    {{ ">" }}
                                </button>
                    </div>
                </v-col>
            </div>
        </v-row>

    </v-container>
</template>