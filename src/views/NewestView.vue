<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useBooksStore } from '@/stores/bookList';
import axios from 'axios'
import { useRoute } from 'vue-router';
import type { AxiosResponse } from 'axios';
import SearchComponent from '@/components/SearchComponent.vue';
const route = useRoute()
const isLoading = ref(false)
const bookList = useBooksStore()

const getCategory = async (limit?: number, skip?: number) => {
    try {
        isLoading.value = true
        const url = `https://www.googleapis.com/books/v1/volumes?q=+orderBy:newest&startIndex=${skip || 0}&maxResults=${limit || 10}&key=${bookList.apiKey}`
        const response: AxiosResponse = await axios.get(url)
        console.log(url);

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
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

onMounted(getCategory)

</script>
<template>
    <h1>New Arrivals in our Library</h1>
    <SearchComponent :bookList="bookList"/>
</template>