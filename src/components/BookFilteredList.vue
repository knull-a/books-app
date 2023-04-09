<script setup lang="ts">
import { useBooksStore } from '@/stores/bookList';
import type { Book, SingleBook } from '@/types/book';
import axios from 'axios';
import { inject, onMounted, type Ref, watchEffect, isRef, watch, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import BookCategoryList from './BookCategoryList.vue';
const bookList = useBooksStore()

const book = inject<Ref<SingleBook>>('book')

const window = ref(0)

const hasAuthor = computed(() => book?.value.volumeInfo.authors !== undefined)

watchEffect(() => getBooks())

async function getBooks() {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${book?.value.volumeInfo.authors[0] === undefined ? '' : book?.value.volumeInfo.authors[0]}&key=${bookList.apiKey}`
        const response = await axios.get(url)
        bookList.books = response.data.items.map((item: SingleBook) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || 'Unknown',
            imageLinks: item.volumeInfo.imageLinks || {},
        }))
    } catch (e) {
        console.log(e)
    }
}

</script>
<template>
    <div class="book__related related author" v-if="hasAuthor">
        <h3 class="related__title text-h4">More from {{ book?.volumeInfo.authors[0] }}</h3>

    </div>
    <v-sheet class="mx-auto mb-3" max-width="900">
        <v-slide-group class="pa-2" show-arrows >
            <v-slide-group-item v-for="n in 10" :key="n">
                <v-container class="related__books" v-for="authorBook in bookList.books">
                    <v-row class="related__books-book">
                        <RouterLink :to="{ name: 'Book', params: { id: authorBook.id } }">
                            <v-img cover width="160" height="280" :src="authorBook.imageLinks.thumbnail" alt="Thumbnail"
                                class="related__image">
                                <template v-slot:placeholder>
                                    <div class="d-flex align-center justify-center fill-height">
                                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                    </div>
                                </template>
                            </v-img>
                        </RouterLink>
                    </v-row>
                </v-container>
            </v-slide-group-item>
        </v-slide-group>
    </v-sheet>
    <BookCategoryList />
</template>

    