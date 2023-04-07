import { defineStore } from "pinia";
import { reactive } from "vue";
import { ref, computed } from "vue";
import { supabase } from "@/data/supabase";
interface credentials {
  email: string;
  password: string;
  username: string;
}

interface loginCredentials {
  email: string
  password: string
}

export const useUserStore = defineStore("user", () => {
  const isValidEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const user = ref();
  const errorMessage = ref("");
  const isLoading = ref(false)

  const handleLogin = async (credentials: loginCredentials) => {

    const {email, password} = credentials

    if(!isValidEmail(email)) {
      return errorMessage.value = "Email is invalid"
    }
    if(!password.length) {
      return errorMessage.value = "Password cannot be empty"
    }
    isLoading.value = true

    const {error} = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      isLoading.value = false;
      return errorMessage.value = error.message
    }
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();
    
      user.value = {
        email: existingUser?.email,
        username: existingUser?.username,
        id: existingUser?.id
      }
      isLoading.value = false
      errorMessage.value = ""
    
  };



  const handleSignup = async (credentials: credentials) => {
    const { email, password, username } = credentials;
    if (password.length < 8) {
      return (errorMessage.value = "Password is not strong enough");
    }
    if (username.length < 3) {
      return (errorMessage.value = "Username is too short");
    }
    if (!isValidEmail(email)) {
      return (errorMessage.value = "Email is invalid");
    }
    errorMessage.value = "";

    //

    isLoading.value = true

    const { data: hasUsername } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    if (hasUsername) {
      isLoading.value = false
      return (errorMessage.value = "User already registered");
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      isLoading.value = false
      console.log(error)
      return (errorMessage.value = error.message);
    }
    
    console.log(data)
    
    await supabase.from("users").insert({
      username,
      email,
    });

    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      id: newUser?.id,
      email: newUser?.email,
      username: newUser?.username
    }
    console.log(newUser)
    
    isLoading.value = false

  };

  const handleLogout = () => {};
  const getUser = () => {};

  return {
    errorMessage,
    isLoading,
    user,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser,
  };
});
export type { credentials };
