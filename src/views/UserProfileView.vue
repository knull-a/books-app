<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const route = useRoute()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const isFollowed = ref(false)

const tab = ref(null)
</script>
<template>
    <v-container v-if="!userStore.isUserLoading">
        <v-row class="align-center">
            <v-col>
                <v-img class="rounded-circle" width="200" aspect-ratio="1" cover
                    src="https://www.giantbomb.com/a/uploads/scale_small/5/56742/3058593-arthur_portrait.jpg">
                </v-img>
            </v-col>
            <v-col>
                <h3 class="mb-2">{{ route.params.username }}</h3>
                <div v-if="user && user.username !== route.params.username">
                    <v-btn v-if="!isFollowed">FOLLOW</v-btn>
                    <v-btn variant="outlined" v-else>FOLLOWED</v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-tabs v-model="tab" align-tabs="title">
                <v-tab>
                    Books
                </v-tab>
                <v-tab>
                    Reviews
                </v-tab>
                <v-tab>
                    Contacts
                </v-tab>
            </v-tabs>
        </v-row>
        <v-row>
            <v-window v-model="tab">
                <v-window-item>
                    Books
                </v-window-item>
                <v-window-item>
                    Reviews
                </v-window-item>
                <v-window-item>
                    Contacts
                </v-window-item>
            </v-window>
        </v-row>
    </v-container>
</template>

<style>
h3 {
    font-size: 2rem;
}
</style>