<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/data/supabase';
import type { BookArray } from '@/types/book';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStarRating } from '@/composables/starRating';
const route = useRoute()
const arrOfBooks = ref<BookArray[]>([])
const isUserLoaded = ref(false)
const isLoaded = ref(false)

const currentUser = ref<{ [x: string]: any } | null>(null);

const fetchData = async () => {
    try {
        const { data: userData } = await supabase
            .from("users")
            .select()
            .eq("username", route.params.username)
            .single()
        if (userData !== undefined) currentUser.value = userData
        fetchReviews()
    } catch (error) {
        console.log(error);
    } finally {
        isUserLoaded.value = true
    }
}

const fetchReviews = async () => {
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
    <div class="mt-10" v-if="isLoaded && arrOfBooks.length && arrOfBooks !== null ">
        <div v-show="arrOfBooks[2].book.length === 0">No books</div>
        <div v-for="book in arrOfBooks[2].book">
            <v-card class="mb-2">
                <v-card-title>{{ route.params.username }} has posted review:</v-card-title>
                <v-card-text>
                    <p class="mb-2" style="font-size: 1.5rem">{{ useStarRating(book.bookReview?.rating as number) }}</p>
                    <p>{{ book.bookReview?.text }}</p>
                </v-card-text>
                
                <v-card-item>
                    <RouterLink :to="`/book/${book.id}`">
                        <v-img width="130" height="200" cover :src="book.image" alt="Thumbnail"></v-img>
                        <h4>{{ book.title }}</h4>
                        <p>{{ book.author[0] }}</p>
                    </RouterLink>
                </v-card-item>
            </v-card>
        </div>
    </div>
    <div class="mt-10" v-else>No reviews</div>
</template>