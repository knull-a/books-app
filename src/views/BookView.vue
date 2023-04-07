<script setup lang="ts">
import BookFilteredList from "@/components/BookFilteredList.vue"
import BookDetails from '@/components/BookDetails.vue';
import { onMounted, reactive, ref, watch, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useBooksStore } from '@/stores/bookList';
import { useStarRating } from '@/composables/starRating';
import { provide } from 'vue';
import axios, { type AxiosResponse } from 'axios';
import type { Book, SingleBook } from '@/types/book'

const route = useRoute()
const bookList = useBooksStore()

const book = ref<SingleBook>({
    id: "",
    volumeInfo: {
        title: "",
        authors: [],
        imageLinks: {
            thumbnail: ""
        },
        averageRating: 0,
        ratingsCount: 0,
        description: "",
        categories: [],
        publisher: "",
        publishedDate: "",
        industryIdentifiers: [],
        pageCount: "",
        printedPageCount: "",
        previewLink: "",
    },
    saleInfo: {
        saleability: "",
        listPrice: {
            amount: 0,
            currencyCode: ""
        },
    }
}
)

const isLoading = ref(false)

const isDetailsOpened = ref(false)

provide('book', book)

const checkSaleability = () => book?.value.saleInfo.saleability === 'FOR_SALE' ? "Buy " + Math.floor(book?.value.saleInfo.listPrice.amount) + book?.value.saleInfo.listPrice.currencyCode : "Not available"

const showRating = () => useStarRating(book?.value.volumeInfo.averageRating ?? 0) || "☆☆☆☆☆"

const checkRating = () => book?.value.volumeInfo.ratingsCount === 1 ? "rating" : "ratings"

const removeTags = () => book?.value.volumeInfo.description ? book?.value.volumeInfo.description.replace(/<.*?>/g, '') : "There is no description."

const getBook = async() => {
    try {
        isLoading.value = true
        const url = `https://www.googleapis.com/books/v1/volumes/${route.params.id}?projection=full&key=${bookList.apiKey}`
        const response: AxiosResponse = await axios.get(url)
        book.value = response.data
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

onMounted(getBook)

watch(() => route.params.id, getBook)

</script>
<template>
    <v-progress-linear class="justify-center" indeterminate v-if="isLoading" model-value="20"></v-progress-linear>
    <v-container class="book" v-else="!isLoading">
        <v-row>
            <v-col cols="3" class="book__side">
                <v-col class="d-flex flex-column ">
                    <v-img width="200" height="320" :src="book?.volumeInfo.imageLinks.thumbnail" alt="Thumbnail"
                        class="book__image">
                        <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center fill-height">
                                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                            </div>
                        </template>
                    </v-img>
                    <v-btn width="200" class="btn btn-primary book__btn mb-1">Want to read</v-btn>
                    <a target="_blank" :href="book?.volumeInfo.previewLink"><v-btn prepend-icon="fas fa-cart-shopping" width="200" class="btn btn-primary book__btn" :class="book?.saleInfo.saleability === 'FOR_SALE' ? 'bg-green' : ''">{{ checkSaleability() }}</v-btn></a>
                </v-col>
            </v-col>
            <v-col cols="9" class="book__main">
                <h2 class="text-h2 font-weight-bold mb-2">{{ book?.volumeInfo.title }}</h2>
                <div class="book__authors mb-2">
                    <p class="text-h5 " v-for="(author, idx) in book?.volumeInfo.authors" :key="idx">{{ author }}</p>
                </div>
                <div class="d-flex mb-2 text-h4 align-center">
                    <span class="mr-2 text-yellow">{{ showRating() }}</span>
                    <span class="text-subtitle-1">{{ book?.volumeInfo.ratingsCount || 0 }} {{ checkRating() }}</span>
                </div>
                <p class="book__description mb-2">{{ removeTags() }}</p>
                <div class="book__categories" v-if="book?.volumeInfo.categories !== undefined">
                    <span class="book__categories_title mr-5">Genres</span>
                    <div class="book__categories_items d-inline">
                        <RouterLink :to="{ name: 'Category', params: { categoryName: category } }" class="mr-4" v-for="(category, idx) in book?.volumeInfo.categories"
                            :key="idx">{{ category }}
                        </RouterLink>
                    </div>
                </div>
                <v-btn density="compact" append-icon="fas fa-chevron-down" variant="plain" v-show="!isDetailsOpened" @click="isDetailsOpened = true" class="text-left pl-0 mb-3">
                    Book details and more
                </v-btn>
                <BookDetails :book="book" v-show="isDetailsOpened" />
                <BookFilteredList />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.text-h2, .text-h5 {
    font-family: 'Playfair Display', serif !important;
}
</style>
