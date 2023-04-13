<script setup lang="ts">
import BookFilteredList from "@/components/BookFilteredList.vue"
import BookDetails from '@/components/BookDetails.vue';
import { onMounted, reactive, ref, watch, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useBooksStore } from '@/stores/bookList';
import { useStarRating } from '@/composables/starRating';
import { provide } from 'vue';
import axios, { type AxiosResponse } from 'axios';
import type { SingleBook, BookArray } from '@/types/book'
import { supabase } from "@/data/supabase";
import { useUserStore } from "@/stores/users";



const userStore = useUserStore()

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
    },
}
)

const isLoading = ref(false)

const isLoaded = ref(false)

const isDetailsOpened = ref(false)

provide('book', book)

const checkSaleability = () => book?.value.saleInfo.saleability === 'FOR_SALE' ? "Buy " + Math.floor(book?.value.saleInfo.listPrice.amount) + book?.value.saleInfo.listPrice.currencyCode : "Not available"

const showRating = () => useStarRating(book?.value.volumeInfo.averageRating ?? 0) || "☆☆☆☆☆"

const checkRating = () => book?.value.volumeInfo.ratingsCount === 1 ? "rating" : "ratings"

const removeTags = () => book?.value.volumeInfo.description ? book?.value.volumeInfo.description.replace(/<.*?>/g, '') : "There is no description."

const getBook = async () => {
    try {
        isLoading.value = true
        const url = `https://www.googleapis.com/books/v1/volumes/${route.params.id}?projection=full&key=${bookList.apiKey}`
        const response: AxiosResponse = await axios.get(url)
        book.value = response.data
        console.log(book.value)
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

onMounted(getBook)

watch(() => route.params.id, getBook)

const listName = ref('Want')

const arrOfBooks = ref<BookArray[]>([
    {
        name: 'Want',
        book: []
    },
    {
        name: 'Reading',
        book: []
    },
    {
        name: 'Read',
        book: []
    }
])

const ratingModal = ref(false)

const isConfirm = ref(false)
const addBook = async (book: SingleBook) => {
    const selectedList = arrOfBooks.value.find((el) => el.name === listName.value);

    if (listName.value === 'Read') {
        ratingModal.value = true
        if (!isConfirm.value && !userReview.rating) return
        ratingModal.value = false;
    }

    if (selectedList) {
        const selectedBookIndex = selectedList.book.findIndex((b) => b.id === book.id);
        if (selectedBookIndex === -1) {
            selectedList.book.push({
                id: book.id,
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors || 'Undefined',
                image: book.volumeInfo.imageLinks.thumbnail,
                bookReview: {
                    text: userReview.text,
                    rating: userReview.rating
                }
            });
        } else {
            selectedList.book.splice(selectedBookIndex, 1, {
                id: book.id,
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors || 'Undefined',
                image: book.volumeInfo.imageLinks.thumbnail,
                bookReview: {
                    text: userReview.text,
                    rating: userReview.rating
                }
            });
        }

        arrOfBooks.value.forEach((el) => {
            if (el.name !== listName.value) {
                const otherBookIndex = el.book.findIndex((b) => b.id === book.id);
                if (otherBookIndex !== -1) {
                    el.book.splice(otherBookIndex, 1);
                }
            }
        });
    }
    userStore.getUserBook(arrOfBooks.value)
    userReview.text = ''
    userReview.rating = 0
    snackbar.value = true
};

const userReview = reactive({
    text: '',
    rating: 0
})

const snackbar = ref(false)

const closeRatingModal = () => {
    ratingModal.value = false
    userReview.rating = 0
}

const confirmRatingModal = () => {
    isConfirm.value = true
    addBook(book.value)
    isConfirm.value = false
}

const isUserLoaded = ref(false)

const currentUser = ref<{ [x: string]: any } | null>(null);

const fetchData = async () => {
    try {
        const { data: userData } = await supabase
            .from("users")
            .select()
            .eq("id", userStore.user?.id)
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
    if (isUserLoaded && currentUser.value) {
        const { data, error } = await supabase
            .from("user_books")
            .select()
            .eq("owner_id", currentUser.value?.id)
        if (data) {
            try {
                // console.log(data.slice(-1)[0].user_books);
                arrOfBooks.value = JSON.parse(data.slice(-1)[0].user_books)
                console.log(arrOfBooks.value);

            } catch {
                console.log(error)
            }
            finally {
                isLoaded.value = true
            }
        } else {
            console.log("No data")
        }


    }
}

onMounted(() => {
    fetchData()
})

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

                    <a target="_blank" :href="book?.volumeInfo.previewLink"><v-btn prepend-icon="fas fa-cart-shopping"
                            width="200" class="my-2" :class="book?.saleInfo.saleability === 'FOR_SALE' ? 'bg-green' : ''">{{
                                checkSaleability()
                            }}</v-btn></a>
                    <div class="d-flex">
                        <v-select style="max-width: 150px" variant="solo" label="Select" density="compact" single-line
                            item-title="Want to Read" v-model="listName" :items="['Want', 'Reading', 'Read']"></v-select>
                        <v-btn @click="addBook(book)" class="ml-2" width="40" height="40" icon="fas fa-plus"></v-btn>
                        <v-snackbar v-model="snackbar">
                            Book was succesfully added to your profile.

                            <template v-slot:actions>
                                <v-btn color="pink" variant="text" @click="snackbar = false">
                                    Close
                                </v-btn>
                            </template>
                        </v-snackbar>
                    </div>
                    <v-dialog v-model="ratingModal" width="auto">
                        <v-card>
                            <v-card-title>
                                How was it?
                            </v-card-title>
                            <v-card-text>
                                <v-textarea v-model="userReview.text" auto-grow label="Short Review"></v-textarea>
                            </v-card-text>
                            <v-card-text>
                                <v-rating size="small" v-model="userReview.rating" hover half-increments></v-rating>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" block @click="confirmRatingModal">Ok</v-btn>
                            </v-card-actions>
                            <v-card-actions><v-btn color="primary" block @click="closeRatingModal">Close
                                </v-btn></v-card-actions>
                        </v-card>
                    </v-dialog>
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
                        <RouterLink :to="{ name: 'Category', params: { categoryName: category } }" class="mr-4"
                            v-for="(category, idx) in book?.volumeInfo.categories" :key="idx">{{ category }}
                        </RouterLink>
                    </div>
                </div>
                <v-btn density="compact" append-icon="fas fa-chevron-down" variant="plain" v-show="!isDetailsOpened"
                    @click="isDetailsOpened = true" class="text-left pl-0 mb-3">
                    Book details and more
                </v-btn>
                <BookDetails :book="book" v-show="isDetailsOpened" />
                <BookFilteredList />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.text-h2,
.text-h5 {
    font-family: 'Playfair Display', serif !important;
}
</style>
