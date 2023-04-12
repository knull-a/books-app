<script setup lang="ts">
import { ref, inject, watchEffect } from 'vue';
import { supabase } from '@/data/supabase';
import type { BookArray } from '@/types/book';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { User } from "@/types/user" 
const route = useRoute()
const tab = ref(null)
const arrOfBooks = ref<BookArray[]>([])
const isLoaded = ref(false)
const isUserLoaded = ref(false)

const currentUser = ref<{ [x: string]: any } | null>(null);

const fetchData = async () => {
    try {
        const { data: userData } = await supabase
            .from("users")
            .select()
            .eq("username", route.params.username)
            .single()
        if (userData !== undefined) currentUser.value = userData
        fetchBooks()
    } catch (error) {
        console.log(error);
    } finally {
        isUserLoaded.value = true
    }
}

const fetchBooks = async () => {
    if (isUserLoaded) {
        await supabase.from('users').select('user_books').then(({ data, error }) => {

            if (data) {
                try {
                    arrOfBooks.value = JSON.parse(currentUser.value?.user_books)
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
    }
}

onMounted(() => {
    fetchData()
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
            <v-window v-model="tab">
                <v-window-item style="min-width: 600px">
                    <div v-if="!arrOfBooks || arrOfBooks === null || !arrOfBooks.length">No books</div>
                    <div v-else>
                        <v-col class="d-flex" v-for="book in arrOfBooks[0].book">
                            <RouterLink style="min-width: 600px" :to="`/book/${book.id}`">
                                <v-img width="130" height="200" cover :src="book.image" alt="Thumbnail"></v-img>
                                <h4>{{ book.title }}</h4>
                                <p>{{ book.author[0] }}</p>
                            </RouterLink>
                        </v-col>
                    </div>
                </v-window-item>
                <v-window-item style="min-width: 600px">
                    <div v-if="!arrOfBooks || arrOfBooks === null || !arrOfBooks.length">No books</div>
                    <div v-else>
                        <v-col v-for="book in arrOfBooks[1].book">
                            <RouterLink :to="`/book/${book.id}`">
                                <v-img width="130" height="200" cover :src="book.image" alt="Thumbnail"></v-img>
                                <h4>{{ book.title }}</h4>
                                <p>{{ book.author[0] }}</p>
                            </RouterLink>
                        </v-col>
                    </div>
                </v-window-item>
                <v-window-item style="min-width: 600px">
                    <div v-if="!arrOfBooks || arrOfBooks === null || !arrOfBooks.length">No books</div>
                    <div v-else>
                        <v-col v-for="book in arrOfBooks[2].book">
                            <RouterLink :to="`/book/${book.id}`">
                                <v-img width="130" height="200" cover :src="book.image" alt="Thumbnail"></v-img>
                                <h4>{{ book.title }}</h4>
                                <p>{{ book.author[0] }}</p>
                            </RouterLink>
                        </v-col>
                    </div>
                </v-window-item>
            </v-window>
            <RouterView />
        </v-col>
    </v-row>
</template>