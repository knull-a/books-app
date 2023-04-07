<script setup lang="ts">
import { ref, defineProps, reactive } from 'vue';
import { useUserStore } from '@/stores/users';
import type { credentials } from "@/stores/users"
import { useField, useForm } from "vee-validate";



const userStore = useUserStore()
const { errorMessage, handleSignup } = userStore
const userCredentials = reactive({
    email: "",
    username: "",
    password: ""
})
const props = defineProps(['isLogin'])

const isVisible = ref(false)

const title = props.isLogin ? 'Login' : 'Signup'

const handleSubmit = (e: string) => {
    handleSignup(userCredentials)
}


</script>
<template>
    <v-row justify="center">
        <v-dialog v-model="isVisible" width="1024">
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    {{ title }}
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ title }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Username" v-model="userCredentials.username"
                                    :error-messages="errorMessage" counter="15" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Email" v-model="userCredentials.email" :error-messages="errorMessage"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Password" v-model="userCredentials.password" type="password" required
                                    :error-messages="errorMessage"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="isVisible = false">
                        Close
                    </v-btn>
                    <v-btn @click="handleSubmit" color="blue-darken-1" variant="text">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>