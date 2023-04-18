<script setup lang="ts">

const props = defineProps<{
    userInfo: {
        followers: number | null
        following: number | null
    }
}>()

</script>
<template>
    <span class="mr-1">{{ props.userInfo.followers }} followers</span>
    <span>{{ props.userInfo.following }} following</span>
</template>