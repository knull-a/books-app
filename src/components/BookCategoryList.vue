<script setup lang="ts">
import { useBooksStore } from '@/stores/bookList';
import axios from 'axios';
import { computed, inject, onMounted, ref, watchEffect, type Ref } from 'vue';
import type { Book, SingleBook } from '@/types/book';
const bookList = useBooksStore()
const books = ref<Book[]>([])
const book = inject<Ref<SingleBook>>('book')

const hasCategory = computed(() => book?.value.volumeInfo.categories !== undefined)

watchEffect(() => getBooks())

async function getBooks() {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=+subject:${book?.value.volumeInfo.categories[0]}&key=${bookList.apiKey}`
        const response = await axios.get(url)
        books.value = response.data.items.map((item: any) => ({
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
    <div class="book__related related category" v-if="hasCategory">
        <h3 class="related__title text-h4">More {{ book?.volumeInfo.categories[0] }}</h3>
        <v-sheet class="mx-auto" max-width="900">
        <v-slide-group class="pa-2" show-arrows >
            <v-slide-group-item v-for="n in 10" :key="n">
                <v-container class="related__books" v-for="categoryBook in books">
                    <v-row class="related__books-book">
                        <RouterLink :to="{ name: 'Book', params: { id: categoryBook.id } }">
                            <v-img cover width="160" height="280" :src="categoryBook.imageLinks.thumbnail" alt="Thumbnail"
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
    </div>
</template>