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

const profilePicture = ref<File>()

const profileAvatars = ref<string[]>([])

const isLoading = ref(false)

const errorMessage = ref("")

const handleImage = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files as FileList
    profilePicture.value = files[0]
    const fileName = Date.now()
    try {
        if (profilePicture.value) {
            isLoading.value = true
            const { data, error } = await supabase.storage.from("profile-picture").upload('public/' + fileName, profilePicture.value)
            if (error) errorMessage.value = "Unexpected error. Please try again later."
            if (data) {
                await supabase.from("user_avatar").insert({
                    url: data.path,
                    owner_id: user.value.id
                })
                profileAvatars.value.unshift(data.path)
                console.log(profileAvatars.value);
                
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }

}

// const changeImage = async () => {
//     const fileName = Date.now()
//     if (file.value) {
//         await supabase.storage.from("profile-picture")
//             .upload('public/' + fileName, file.value )
//     }
// }

</script>
<template>
    <v-container v-if="!userStore.isUserLoading">
        <div class="d-flex justify-center align-center mb-10">
            <v-alert v-if="errorMessage" title="Alert title" :text="errorMessage" type="error"></v-alert>
            <div class="mr-5">
                <label for="avatar">
                    <v-img style="cursor: pointer;" class="rounded-circle" width="200" aspect-ratio="1" cover
                        :src="`https://dimgfhkbhgxjqybowbmf.supabase.co/storage/v1/object/public/profile-picture/${profileAvatars[0]}`">
                    </v-img>
                </label>
                <input type="file" id="avatar" @change="handleImage" hidden>
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

<style scoped>
h3 {
    font-size: 2rem;
}
</style>