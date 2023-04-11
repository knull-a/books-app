<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, watch, watchEffect, computed } from 'vue'
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { SingleBook } from '@/types/book';
import { useBooksStore } from '@/stores/bookList';
import SearchComponent from '@/components/SearchComponent.vue';

const bookList = useBooksStore()

const totalBooks = ref(0)

const route = useRoute()

const isLoading = ref(false)

const getCategory = async () => {
    try {
        isLoading.value = true
        const url = `https://www.googleapis.com/books/v1/volumes?q=+subject:${route.params.categoryName}&startIndex=${page.value === 1 ? page.value : page.value * 10}&maxResults=10&key=${bookList.apiKey}`
        const response: AxiosResponse = await axios.get(url)
        console.log(url);
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
            saleInfo: item.saleInfo,
        }))
        
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

onMounted(getCategory)

const page = ref(1);

</script>

<template>
    <div>
        {{ page }}
        <h3 class="text-h4">The Best of {{ route.params.categoryName }}</h3>
        <SearchComponent :bookList="bookList" />
        <v-pagination @click="getCategory" v-model="page" :length="30"></v-pagination>
    </div>
    
</template>