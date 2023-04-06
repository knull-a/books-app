import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
   },
   {
    path: "/categories/:categoryName",
    name: "Category",
    component: () => import("@/views/CategoriesView.vue")
   },
   {
    path: "/newest",
    name: "Newest",
    component: () => import("@/views/NewestView.vue")
   }
  ]
})

export default router
