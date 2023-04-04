<script setup lang="ts">
// AIzaSyCayVRubdihrXqBykrVwZ_NuuN4IU4-gGI
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useBooksStore } from '@/stores/bookList';
import { useStarRating } from '@/composables/starRating';

const bookList = useBooksStore()

const isLoading = ref(false)

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

console.log(order.value)

async function getBooks(limit?: number, skip?: number) {
    try {
        if (searchQuery.value === '') return
        [isLoading.value, hasData.value] = [true, true]
        const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery.value}&orderBy=${order.value}&startIndex=${skip || 0}&maxResults=${limit || 10}&key=${bookList.apiKey}`;
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
    }
}
</script>

<template>
    <div class="search">
        <div class="search__box">
            <input type="text" v-model="searchQuery" @keypress.enter="getBooks()">
            <button @click="getBooks()">Search</button>
            <select name="sort" v-model="order">
                <option value="relevance">relevance</option>
                <option value="newest">newest</option>
            </select>
        </div>
        <div class="search__list">
            <div class="search__loading" v-if="isLoading">Loading...</div>
            <div class="search__result" v-show="hasData" v-else="loading = false">
                <p>{{ totalBooks }}</p>
                <RouterLink class="search__book book" :to="{ name: 'Book', params: { id: book.id } }" v-for="book in bookList.books" :key="book.id">
                    <img class="book__image" :src="book.imageLinks.smallThumbnail" alt="Thumbnail">
                    <div class="book__main">
                        <h3 class="book__title">{{ book.title }}</h3>
                        <p class="book__author">By {{ book.authors.toString().replace(/,/g, ", ")}}</p>
                        <p class="book__rating">{{ useStarRating(parseInt(book.averageRating)) || "☆☆☆☆☆" }} {{ book.averageRating }}</p>
                    </div>
                </RouterLink>
                <div class="search__pagination">
                    <button @click="previousPage">
                        {{ "<" }}
                    </button>
                    <button @click="nextPage">
                        {{ ">" }}
                    </button>
                </div>
            </div>
        </div>
        
    </div>
</template>