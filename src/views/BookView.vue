<script setup lang="ts">
import { inject } from 'vue';
import { useRoute } from 'vue-router';

const props = inject()

const route = useRoute()

// const book = props.books.find((el: any) => el.id == route.params.id)

</script>
<template>
<div>
{{ props.books }}
</div>
</template>
