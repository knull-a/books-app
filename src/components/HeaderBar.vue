<script setup lang="ts">
import AuthPage from '@/components/AuthPage.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';

const userStore = useUserStore()

const {user, isUserLoading} = storeToRefs(userStore)
</script>

<template>
    <v-row v-if="!isUserLoading" justify="end" no-gutters class="mt-2">
        <div v-if="!user">
            <AuthPage :isLogin="true" />
            <AuthPage :isLogin="false" />
        </div>
    </v-row>
</template>