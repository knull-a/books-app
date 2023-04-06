<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, watch, watchEffect, computed } from 'vue'
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useBooksStore } from '@/stores/bookList';
import { useStarRating } from '@/composables/starRating';
import SearchComponent from '@/components/SearchComponent.vue';

const bookList = useBooksStore()

const category = ref()

const route = useRoute()

const isLoading = ref(false)

const getCategory = async (limit?: number, skip?: number) => {
    try {
        isLoading.value = true
        const url = `https://www.googleapis.com/books/v1/volumes?q=+subject:${route.params.categoryName}&startIndex=${page.value}&maxResults=${limit || 10}&key=${bookList.apiKey}`
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

const page = ref(0);

const perPage = 10;

const paginatedData = computed(() =>
  bookList.books.slice((page.value - 1) * perPage, page.value * perPage)
);

const nextPage = () => {
  if (page.value !== Math.ceil(bookList.books.length / perPage)) {
    page.value += 1;
  }
};

const backPage = () => {
  if (page.value !== 1) {
    page.value -= 1;
  }
};

const goToPage = (numPage: number) => {
  page.value = numPage;
};




// const appComponent = {
//   name: "App",
//   ...handlePaginationValue,
// };

</script>

<template>
    <div>
        <h3 class="text-h4">The Best of {{ route.params.categoryName }}</h3>
        <SearchComponent :bookList="bookList" />
        <!-- <v-col cols="12">
            <div class="search__pagination">
                <button @click="previousPage">
                    {{ "<" }} </button>
                        <button @click="nextPage">
                            {{ ">" }}
                        </button>
            </div>
        </v-col> -->
    </div>
    <div>
        <div v-for="item in bookList.books.length">{{ item }}</div>
        <button @click="backPage">prev</button>
        <button v-for="item in Math.ceil(bookList.books.length / perPage)" :key="item" @click = "goToPage(item)">
            {{ item }}
        </button>
        <button @click="nextPage">next</button>
    </div>
</template>