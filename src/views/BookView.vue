<script setup lang="ts">
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import BookFilteredList from "@/components/BookFilteredList.vue"
import BookDetails from '@/components/BookDetails.vue';
import { onMounted, reactive, ref, watchEffect, computed } from 'vue';
import { useRoute } from 'vue-router';
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

const checkSaleability = () => book?.value.saleInfo.saleability === 'FOR_SALE' ? "Buy" + Math.floor(book?.value.saleInfo.listPrice.amount) + book?.value.saleInfo.listPrice.currencyCode : "Not available"

const showRating = () => useStarRating(book?.value.volumeInfo.averageRating ?? 0) || "☆☆☆☆☆"

const checkRating = () => book?.value.volumeInfo.ratingsCount === 1 ? "rating" : "ratings"

const removeTags = () => book?.value.volumeInfo.description ? book?.value.volumeInfo.description.replace(/<.*?>/g, '') : "There is no description."

onMounted(async () => {
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
})

</script>
<template>
    <div class="loading" v-if="isLoading === true">Loading...</div>
    <div class="book" v-else="isLoading === false">
        <div class="book__side">
            <img :src="book?.volumeInfo.imageLinks.thumbnail" alt="Thumbnail" class="book__image">
            <button class="btn btn-primary book__btn">Want to read</button>
            <button class="btn btn-primary book__btn">{{ checkSaleability() }}</button>
        </div>
        <div class="book__main">
            <h2 class="book__title">{{ book?.volumeInfo.title }}</h2>
            <div class="book__authors">
                <p class="book__author" v-for="(author, idx) in book?.volumeInfo.authors" :key="idx">{{ author }}</p>
            </div>
            <div class="book__rating">
                <span class="book__rating_stars">{{ showRating() }}</span>
                <span class="book__rating_count">{{ book?.volumeInfo.ratingsCount || 0 }} {{ checkRating() }}</span>
            </div>
            <p class="book__description">{{ removeTags() }}</p>
            <div class="book__categories">
                <span class="book__categories_title">Genres:</span>
                <div class="book__categories_items">
                    <span class="book__categories_items_item"
                        v-if="book?.volumeInfo.categories === undefined">Undefined</span>
                    <span class="book__categories_items-item" v-for="(category, idx) in book?.volumeInfo.categories"
                        :key="idx">{{ category }}
                    </span>
                </div>
            </div>
            <button v-show="!isDetailsOpened" @click="isDetailsOpened = true" class="book__details-open">
                Book details and more
                <IconArrowDown />
            </button>

            <BookDetails :book="book" v-show="isDetailsOpened" />
            <BookFilteredList />
        </div>
    </div>
</template>
