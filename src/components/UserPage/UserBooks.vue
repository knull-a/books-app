<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/data/supabase';
import type { BookArray } from '@/types/book';
import { onMounted } from 'vue';
const tab = ref(null)
const arrOfBooks = ref<BookArray[]>([])
const isLoaded = ref(false)

onMounted(async () => {
    await supabase.from('users').select('user_books').then(({ data, error }) => {
        if (data) {
            try {
                arrOfBooks.value = JSON.parse(data[0].user_books)
                console.log(arrOfBooks.value)
            } catch {
                console.log(error)
            }
            finally {
                isLoaded.value = true
            }
        } else {
            console.log("No data")
        }

    })
})
</script>

<template>
    <v-row v-if="isLoaded">
        <v-col cols="6">
            <v-tabs direction="vertical" v-model="tab">
                <v-tab>
                    Want
                </v-tab>
                <v-tab>
                    Reading
                </v-tab>
                <v-tab>
                    Finished
                </v-tab>
            </v-tabs>
        </v-col>
        <v-col cols="6">
            <v-window v-if="arrOfBooks" v-model="tab">
                <v-window-item>
                    <div v-show="arrOfBooks[0].book.length === 0">No books</div>
                    <v-col v-for="book in arrOfBooks[0].book">
                        <RouterLink :to="`/book/${book.id}`">
                            <v-img width="130" height="200" cover :src="book.image" alt="Thumbnail"></v-img>
                            <h3>{{ book.title }}</h3>
                            <p>{{ book.author[0] }}</p>
                        </RouterLink>
                    </v-col>
                </v-window-item>
                <v-window-item>
                    <div v-show="arrOfBooks[1].book.length === 0">No books</div>
                    <v-col v-for="book in arrOfBooks[1].book">
                        <RouterLink :to="`/book/${book.id}`">
                            <v-img width="130" height="200" cover :src="book.image" alt="Thumbnail"></v-img>
                            <h3>{{ book.title }}</h3>
                            <p>{{ book.author[0] }}</p>
                        </RouterLink>
                    </v-col>
                </v-window-item>
                <v-window-item>
                    <div v-show="arrOfBooks[2].book.length === 0">No books</div>
                    <v-col v-for="book in arrOfBooks[2].book">
                        <RouterLink :to="`/book/${book.id}`">
                            <v-img width="130" height="200" cover :src="book.image" alt="Thumbnail"></v-img>
                            <h3>{{ book.title }}</h3>
                            <p>{{ book.author[0] }}</p>
                        </RouterLink>
                    </v-col>
                </v-window-item>
            </v-window>
            <RouterView />
        </v-col>
    </v-row>
</template>