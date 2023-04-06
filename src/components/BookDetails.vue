<script setup lang="ts">
import type { SingleBook } from '@/types/book';
import { useCopyToClipboard } from '@/composables/copyToClipboard';
const { copyToClipboard, copied } = useCopyToClipboard()

const props = defineProps<{
    book: SingleBook
}>()


const hasIndustryIndentifier = () => props.book?.volumeInfo.industryIdentifiers === undefined ? `There is no ISBN information` : props.book?.volumeInfo?.industryIdentifiers[1]?.identifier

</script>
<template>
    <v-container class="book__details pl-0">
        <v-row class="book__details_item">
            <v-col cols="2" class="book__details_item-key">Publisher</v-col>
            <v-col cols="6" class="book__details_item-value">{{ book?.volumeInfo.publisher }} in {{
                book?.volumeInfo.publishedDate || "Unknown" }}</v-col>
        </v-row>
        <v-row class="book__details_item">
            <v-col cols="2" class="book__details_item-key">ISBN</v-col>
            <v-hover v-slot="{ isHovering, props }"><v-col style="cursor: pointer" cols="6" class="book__details_item-value"
                    v-bind="props" :class="{ 'text-grey': isHovering }"
                    @click="copyToClipboard(hasIndustryIndentifier())">{{
                        hasIndustryIndentifier() }} <p v-show="copied">Copied to clipboard!</p></v-col></v-hover>

        </v-row>
        <v-row class="book__details_item">
            <v-col cols="2" class="book__details_item-key">Format</v-col>
            <v-col cols="6" class="book__details_item-value">{{ book?.volumeInfo.pageCount + " pages" ||
                book?.volumeInfo.printedPageCount + " pages" || "There is no format information" }}</v-col>
        </v-row>
        <v-row class="book__details_item">
            <v-col cols="2" class="book__details_item-key">Links</v-col>
            <v-col cols="6" class="book__details_item-value"><a target="_blank" :href="book?.volumeInfo.previewLink">Google
                    Books</a></v-col>
        </v-row>
    </v-container>
</template>

<style>
.red {
    color: red;
}
</style>