<script setup lang="ts">
import AuthPage from '@/components/AuthPage.vue';
</script>

<template>
    <v-row justify="end" no-gutters class="mt-2">
        <div>
            <AuthPage isLogin="isLogin" />
            <AuthPage !isLogin="isLogin" />
        </div>
    </v-row>
</template>