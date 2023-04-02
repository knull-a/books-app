import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Book } from '@/types/book'

export const useBooksStore = defineStore('bookList', () => {
  const apiKey = "AIzaSyCayVRubdihrXqBykrVwZ_NuuN4IU4-gGI"
  const books = ref<Book[]>([])
  return {books, apiKey}
})
