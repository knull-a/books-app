<script setup lang="ts">
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import BookFilteredList from "@/components/BookFilteredList.vue"
import BookCategoryList from '@/components/BookCategoryList.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useBooksStore } from '@/stores/bookList';
import { useStarRating } from '@/composables/starRating';
import { provide } from 'vue';
import axios from 'axios';

const route = useRoute()
const bookList = useBooksStore()

const book = ref<any>()

const isLoading = ref(false)

const isDetailsOpened = ref(false)

console.log(route.params.id)



onMounted(async () => {
    try {
        isLoading.value = true
        const url = `https://www.googleapis.com/books/v1/volumes/${route.params.id}?projection=full&key=${bookList.apiKey}`
        const response = await axios.get(url)
        book.value = response.data
    } catch(error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
})

// onMounted(() => {
//     isLoaded.value = bookImage.value.complete && bookImage.value.naturalHeight !== 0
// });

</script>
<template>
<div class="loading" v-if="isLoading === true">Loading...</div>
<div class="book" v-else="isLoading === false">
    <div class="book__side">
        <img :src="book?.volumeInfo.imageLinks.thumbnail" alt="Thumbnail" class="book__image">        
        <button class="btn btn-primary book__btn">Want to read</button>
        <button class="btn btn-primary book__btn">{{ book?.saleInfo.saleability === 'FOR_SALE' ? "Buy" + Math.floor(book?.saleInfo.listPrice.amount) + book?.saleInfo.listPrice.currencyCode : "Not available" }}</button>
    </div>
    <div class="book__main">
        <h2 class="book__title">{{ book?.volumeInfo.title }}</h2>
        <div class="book__authors">
            <p class="book__author" v-for="author in book?.volumeInfo.authors">{{ book?.volumeInfo.authors.toString().replace(/,/g, ", ") }}</p>
        </div>
        <div class="book__rating">
            <span class="book__rating_stars">{{ useStarRating(parseInt(book?.volumeInfo.averageRating)) || "☆☆☆☆☆" }}</span>
            <span class="book__rating_count">{{ book?.volumeInfo.ratingsCount }} {{ book?.volumeInfo.ratingsCount === 1 ? "rating" : "ratings" }}</span>
        </div>
        <p class="book__description">{{ book?.volumeInfo.description.replace(/<.*?>/g, '') || "There is no description." }}</p>
        <div class="book__categories">
            <span class="book__categories_title">Genres:</span>
            <div class="book__categories_items">
                <span class="book__categories_items_item" v-if="book?.volumeInfo.categories === undefined">Undefined</span>
                <span class="book__categories_items-item" v-for="category in book?.volumeInfo.categories">{{ category }}</span>
            </div>
        </div>
        <button v-show="!isDetailsOpened" @click="isDetailsOpened = true" class="book__details-open">Book details and more <IconArrowDown /> </button>
        <div class="book__details" v-show="isDetailsOpened">
            <div class="book__details_item">
                <span class="book__details_item-key">Publisher</span>
                <span class="book__details_item-value">{{ book?.volumeInfo.publisher }} in {{ book?.volumeInfo.publishedDate || "Unknown" }}</span>
            </div>
            <div class="book__details_item">
                <span class="book__details_item-key">ISBN</span>
                <span class="book__details_item-value">{{ book?.volumeInfo.industryIdentifiers === undefined ? "There is no ISBN information" : book?.volumeInfo.industryIdentifiers[1].identifier }}</span>
            </div>
            <div class="book__details_item">
                <span class="book__details_item-key">Format</span>
                <span class="book__details_item-value">{{ book?.volumeInfo.pageCount + " pages" || book?.volumeInfo.printedPageCount + " pages" || "There is no format information" }}</span>
            </div>
            <div class="book__details_item">
                <span class="book__details_item-key">Links</span>
                <span class="book__details_item-value"><a target="_blank" :href="book?.volumeInfo.previewLink">Google Books</a></span>
            </div>
        </div>
        <BookFilteredList :book="book" />
    </div>
</div>

</template>
