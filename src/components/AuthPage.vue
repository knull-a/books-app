<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/users';
import type { credentials } from "@/stores/users"
import { storeToRefs } from 'pinia';


const userStore = useUserStore()
const { errorMessage, isLoading, user } = storeToRefs(userStore)
const userCredentials = reactive({
    email: "",
    username: "",
    password: ""
})
const props = defineProps(['isLogin'])

const isVisible = ref(false)

const title = ref(props.isLogin ? 'Login' : 'Sign Up')

const clearUserCredentials = () => {
    userCredentials.email = ""
    userCredentials.username = ""
    userCredentials.password = ""
    errorMessage.value = ''
}
const handleClose = () => {
    isVisible.value = false
    clearUserCredentials()
    userStore.getUser()
}

const handleSubmit = async () => {
    if (props.isLogin) {
        await userStore.handleLogin({
            password: userCredentials.password,
            email: userCredentials.email
        })
    } else {
        await userStore.handleSignup(userCredentials)
        console.log('islogin else');
    }
    if (user.value) {
        handleClose()
    }
    console.log(user.value)
}






</script>
<template>
    <v-dialog width="1024" v-model="isVisible">
        <template v-slot:activator="{ props }">
            <v-btn variant="text" class="mx-2" rounded="xl" v-bind="props">
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
                        <v-col cols="12">
                            <v-text-field @keydown.enter="handleSubmit" label="Username" v-if="!isLogin" v-model="userCredentials.username" counter="15"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field @keydown.enter="handleSubmit" label="Email" v-model="userCredentials.email" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field @keydown.enter="handleSubmit" label="Password" v-model="userCredentials.password" type="password"
                                required></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <span class="text-red">{{ errorMessage }}</span>
                <v-btn color="blue-darken-1" variant="text" @click="handleClose">
                    Close
                </v-btn>
                <v-btn :loading="isLoading" @click="handleSubmit" color="blue-darken-1" variant="text">
                    Submit
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>