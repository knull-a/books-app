<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { supabase } from '@/data/supabase';
import { ref } from 'vue';

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const isFollowed = ref(false)

const toggle = ref(null)


</script>
<template>
    <v-container v-if="!userStore.isUserLoading">
        <div class="d-flex justify-center align-center mb-10">
            <div class="mr-5">
                <v-img class="rounded-circle" width="200" aspect-ratio="1" cover
                    src="https://www.giantbomb.com/a/uploads/scale_small/5/56742/3058593-arthur_portrait.jpg">
                </v-img>
            </div>
            <div>
                <h3 class="mb-2">{{ route.params.username }}</h3>
                <div v-if="user && user.username !== route.params.username">
                    <v-btn v-if="!isFollowed">FOLLOW</v-btn>
                    <v-btn variant="outlined" v-else>FOLLOWED</v-btn>
                </div>
            </div>
        </div>
        <v-row class="justify-center">
            <!-- todo: add active to buttons when reloading the page -->
            <v-btn-toggle v-model="toggle" divided>
                <v-btn @click="router.push(`/user/${route.params.username}/books`)">Books</v-btn> 
                <v-btn @click="router.push(`/user/${route.params.username}/reviews`)">Reviews</v-btn>
                <v-btn @click="router.push(`/user/${route.params.username}/contacts`)">Contacts</v-btn>
            </v-btn-toggle>
        </v-row>

        <RouterView />

    </v-container>
</template>

<style>
h3 {
    font-size: 2rem;
}
</style>