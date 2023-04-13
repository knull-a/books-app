<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { ref, onMounted, provide, watchEffect, watch } from 'vue';
import { supabase } from '@/data/supabase';
import UserProfileAvatar from '@/components/UserProfileAvatar.vue';

interface UserInfo {
    followers: number | null
    following: number | null
}

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)

const userStore = useUserStore()

const { user } = storeToRefs(userStore)
const currentUser = ref<{ [x: string]: any } | null>(null);

const isFollowing = ref(false)

const toggle = ref(null)

const isUserLoaded = ref(false)

const userInfo = ref<UserInfo>({
    followers: 0,
    following: 0
})

const fetchIsFollowing = async () => {
    if (user.value && (user.value?.id !== currentUser?.value?.id)) {
        const { data } = await supabase
            .from("followers_following")
            .select()
            .eq("follower_id", user.value?.id)
            .eq("following_id", currentUser?.value?.id)
            .single()
        if (data) isFollowing.value = true
    }

}

const followUser = async () => {
    updateIsFollowing(true)
    await supabase
        .from("followers_following")
        .insert({
            follower_id: user.value?.id,
            following_id: currentUser?.value?.id
        })
}

const unfollowUser = async () => {
    updateIsFollowing(false)
    await supabase
        .from("followers_following")
        .delete()
        .eq("follower_id", user.value?.id)
        .eq("following_id", currentUser?.value?.id)
}

const updateIsFollowing = (follow: boolean) => isFollowing.value = follow

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
        await fetchIsFollowing()
        const followerCount = await fetchFollowersCount()
        const followingCount = await fetchFollowingCount()

        userInfo.value.followers = followerCount
        userInfo.value.following = followingCount
        // todo: add books counter
        isUserLoaded.value = true
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}

const fetchFollowersCount = async () => {
    const {count} = await supabase
        .from("followers_following")
        .select("*", {count: 'exact'})
        .eq("following_id", currentUser?.value?.id)
    return count
}

const fetchFollowingCount = async () => {
    const {count} = await supabase
        .from("followers_following")
        .select("*", {count: 'exact'})
        .eq("follower_id", currentUser?.value?.id)
    return count
}

onMounted(() => {
    fetchData()
})

watchEffect(() => {
    fetchData()
})

watch(user, () => {
    fetchIsFollowing()
})


</script>
<template>
    <v-container v-if="!userStore.isUserLoading && !isLoading">
        <div class="d-flex justify-center align-center mb-10">
            <UserProfileAvatar isUserLoaded :currentUser="currentUser" />
            <div v-if="currentUser">
                <h3 class="mb-2">{{ currentUser.username }}</h3>
                <div v-if="user && user.username !== route.params.username">
                    <v-btn @click="followUser" v-if="!isFollowing">FOLLOW</v-btn>
                    <v-btn @click="unfollowUser" variant="outlined" v-else>FOLLOWED</v-btn>
                </div>
                <div class="d-flex mt-2">
                    <span class="mr-1">{{ userInfo.followers }} followers</span>
                    <span>{{ userInfo.following }} following</span>
                </div>
            </div>
        </div>
        <v-row class="justify-center">
            <v-btn-toggle v-model="toggle" divided>
                <v-btn @click="router.push(`/user/${route.params.username}/books`)">Books</v-btn>
                <v-btn @click="router.push(`/user/${route.params.username}/reviews`)">Reviews</v-btn>
                <!-- <v-btn @click="router.push(`/user/${route.params.username}/contacts`)">Contacts</v-btn> -->
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