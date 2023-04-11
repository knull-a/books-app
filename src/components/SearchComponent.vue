<script setup lang="ts">
import { useStarRating } from '@/composables/starRating';
import type { Book, BookList } from '@/types/book';

const props = defineProps<{
    bookList: BookList
}>()

</script>
<template>
    <v-col class="d-flex flex-column" cols="6">
        <RouterLink class="d-inline-flex my-2" :to="{ name: 'Book', params: { id: book.id } }"
            v-for="book in props.bookList.books" :key="book.id">
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
    
</template>