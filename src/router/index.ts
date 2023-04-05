import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
   {
    path: "/",
    name: "Search",
    component: () => import("@/components/SearchQuery.vue")
   },
   {
    path: "/search",
    redirect: "/"
   },
   {
    path: "/book/:id",
    name: "Book",
    component: () => import("@/views/BookView.vue")
   }
  ]
})

export default router
