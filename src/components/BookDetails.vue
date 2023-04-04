<script setup lang="ts">
import type { SingleBook } from '@/types/book';

const props = defineProps<{
    book: SingleBook
}>()


const hasIndustryIndentifier = () => props.book?.volumeInfo.industryIdentifiers === undefined ? `There is no ISBN information` : props.book?.volumeInfo?.industryIdentifiers[1]?.identifier

</script>
<template>
    <div class="book__details">
        <div class="book__details_item">
            <span class="book__details_item-key">Publisher</span>
            <span class="book__details_item-value">{{ book?.volumeInfo.publisher }} in {{
                book?.volumeInfo.publishedDate || "Unknown" }}</span>
        </div>
        <div class="book__details_item">
            <span class="book__details_item-key">ISBN</span>
            <span class="book__details_item-value">{{ hasIndustryIndentifier() }}</span>
        </div>
        <div class="book__details_item">
            <span class="book__details_item-key">Format</span>
            <span class="book__details_item-value">{{ book?.volumeInfo.pageCount + " pages" ||
                book?.volumeInfo.printedPageCount + " pages" || "There is no format information" }}</span>
        </div>
        <div class="book__details_item">
            <span class="book__details_item-key">Links</span>
            <span class="book__details_item-value"><a target="_blank" :href="book?.volumeInfo.previewLink">Google
                    Books</a></span>
        </div>
    </div>
</template>