<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue';
import { RouterLink } from 'vue-router';
import { ref, watchEffect, inject } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';
import { useUserAvatarStore } from '@/stores/userAvatar';
import AuthPage from './AuthPage.vue';

const userStore = useUserStore()
const userAvatarStore = useUserAvatarStore()
const { user } = storeToRefs(userStore)


const drawer = ref(true)
const rail = ref(true)

</script>

<template>
    <v-card>
        <v-navigation-drawer permanent v-model="drawer" :rail="rail" @click="rail = false">
            <RouterLink v-if="user" :to="`/user/${user.username}`">
                <v-list-item :prepend-avatar="userAvatarStore.profileAvatars ? `https://dimgfhkbhgxjqybowbmf.supabase.co/storage/v1/object/public/profile-picture/${userAvatarStore.profileAvatars}` : 'https://i.ibb.co/jw7MWpz/no-avatar.png'"
                    :title="user.username" nav>
                </v-list-item>
            </RouterLink>
            <v-list-item class="d-flex" :class="rail ? 'justify-start' : 'justify-center'" v-else :prepend-avatar="rail ? 'https://i.ibb.co/YNRg1PL/no-avatar.png' : ''"
                     nav>
                    <AuthPage />
            </v-list-item>


            <v-divider></v-divider>

            <v-list mandatory density="compact" nav>
                <RouterLink to="/" active-class="v-list-item--active"><v-list-item prepend-icon="fas fa-search"
                        title="Search" value="search"></v-list-item></RouterLink>
                <RouterLink to="/bookshelves" active-class="v-list-item--active"><v-list-item prepend-icon="fas fa-book"
                        title="Bookshelves" value="bookshelves"></v-list-item></RouterLink>
                <RouterLink to="/newest" active-class="v-list-item--active"><v-list-item prepend-icon="fas fa-star"
                        title="Newest" value="newest"></v-list-item></RouterLink>
            </v-list>

                
                <v-list class="d-flex align-center mt-16 justify-end">
                    <v-btn v-show="!rail" variant="text" icon="fas fa-chevron-left" @click.stop="rail = !rail"></v-btn>
                </v-list>
                

            <template v-slot:append>
                <v-divider></v-divider>
                <v-list-item prepend-icon="fas fa-code">
                    <form target="_blank" action="https://developers.google.com/books/">
                        <v-btn type="submit">API</v-btn>
                    </form>
                </v-list-item>
                <v-list-item prepend-icon="fas fa-circle-half-stroke fa-rotate-180">
                    <ThemeToggle />
                </v-list-item>
                <v-list-item @click="userStore.handleLogout" v-if="user"
                    prepend-icon="fas fa-right-from-bracket"><v-btn>Logout</v-btn></v-list-item>
            </template>
        </v-navigation-drawer>
    </v-card>
</template>