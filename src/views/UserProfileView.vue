<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { ref, onMounted, provide, watchEffect } from 'vue';
import { supabase } from '@/data/supabase';
import UserProfileAvatar from '@/components/UserProfileAvatar.vue';

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)

const userStore = useUserStore()

const { user } = storeToRefs(userStore)
const currentUser = ref<{ [x: string]: any } | null>(null);

const isFollowed = ref(false)

const toggle = ref(null)

const isUserLoaded = ref(false)

const notFoundMessage = ref('User not found')

const fetchData = async () => {
    try {
        isLoading.value = true
        const { data: userData } = await supabase
            .from("users")
            .select()
            .eq("username", route.params.username)
            .single()
        if (!userData) {
            isLoading.value = false
            return currentUser.value = null
        } 
        currentUser.value = userData
        console.log(JSON.parse(currentUser.value.user_books));
        isUserLoaded.value = true
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }

}

onMounted(() => {
    fetchData()
})

watchEffect(() => {
    fetchData()
})

</script>
<template>
    <v-container v-if="!userStore.isUserLoading && !isLoading">
        <div class="d-flex justify-center align-center mb-10">
            <UserProfileAvatar isUserLoaded :currentUser="currentUser" />
            <div v-if="currentUser">
                <h3 class="mb-2">{{ currentUser.username }}</h3>
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

<style scoped>
h3 {
    font-size: 2rem;
}
</style>