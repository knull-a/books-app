<script lang="ts">
import ThemeToggle from './ThemeToggle.vue';

export default {
    data() {
        return {
            drawer: true,
            items: [
                { title: "Search", icon: "fas fa-search" },
                { title: "Bookshelves", icon: "fas fa-book" },
                { title: "Newest", icon: "fas fa-star" },
                { title: "API", icon: "fas fa-code" },
            ],
            rail: true,
        };
    },
    components: { ThemeToggle }
}
</script>

<template>
    <v-card>
        <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
            <v-list-item prepend-avatar="https://upload.wikimedia.org/wikipedia/en/2/2e/Tony_Soprano_2.jpg"
                title="Tony Soprano" nav>
                <template v-slot:append>
                    <v-btn variant="text" icon="fas fa-chevron-left" @click.stop="rail = !rail"></v-btn>
                </template>
            </v-list-item>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item prepend-icon="fas fa-search" title="Search" value="search"></v-list-item>
                <v-list-item prepend-icon="fas fa-book" title="Bookshelves" value="bookshelves"></v-list-item>
                <v-list-item prepend-icon="fas fa-star" title="Newest" value="newest"></v-list-item>
                <v-list-item prepend-icon="fas fa-code" title="API" value="api"></v-list-item>

            </v-list>
            <template v-slot:append>
                <v-list-item prepend-icon="fas fa-circle-half-stroke fa-rotate-180">
                    <ThemeToggle />
                </v-list-item>
                <v-list-item prepend-icon="fas fa-right-from-bracket"><v-btn>Logout</v-btn></v-list-item>
            </template>
        </v-navigation-drawer>
</v-card></template>