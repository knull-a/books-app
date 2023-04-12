<script setup lang="ts">
import { supabase } from '@/data/supabase';
import { ref, onMounted, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users'
import { useRoute } from 'vue-router';

const props = defineProps<{
    currentUser: { [x: string]: any } | null
    isUserLoaded: boolean
}>()

const profileAvatars = ref<string>('')

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const profilePicture = ref<File>()


const isLoading = ref(false)
const errorMessage = ref("")


const fetchData = async () => {
    if (props.currentUser) {
        const { data: avatarData, error } = await supabase
            .from("user_avatar")
            .select()
            .eq("owner_id", props.currentUser.id)
        if (avatarData) {
            profileAvatars.value = avatarData.slice(-1)[0].url
        }
        if (error) {
            console.log(error);
        }
    }
}

onMounted(() => {
    fetchData()
})

const handleImage = async (e: Event) => {
    isLoading.value = true
    const files = (e.target as HTMLInputElement).files as FileList
    profilePicture.value = files[0]
    const fileName = Date.now()
    try {
        if (profilePicture.value) {
            const { data, error } = await supabase.storage.from("profile-picture").upload('public/' + fileName, profilePicture.value)
            const dataPath = data?.path
            if (error) {
                console.log(error)
            }
            if (data) {
                await supabase.from("user_avatar").insert({
                    url: dataPath,
                    owner_id: user?.value?.id,
                })
                profileAvatars.value = (dataPath as string)
                console.log(profileAvatars.value, 'upload avatar');
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}
</script>
<template>
    <div class="mr-5">
        <v-alert v-if="errorMessage" title="Alert title" :text="errorMessage" type="error"></v-alert>
        <label for="avatar">
            <v-img style="cursor: pointer;" class="rounded-circle" width="200" aspect-ratio="1" cover
                :src="profileAvatars ? `https://dimgfhkbhgxjqybowbmf.supabase.co/storage/v1/object/public/profile-picture/${profileAvatars}` : 'https://i.ibb.co/jw7MWpz/no-avatar.png'">
            </v-img>
        </label>
        <input type="file" accept="image/png, image/jpeg" id="avatar" @change="handleImage" hidden>
    </div>
    <v-dialog v-model="isLoading" :scrim="false" persistent width="auto">
        <v-card color="primary">
            <v-card-text>
                Please stand by
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>