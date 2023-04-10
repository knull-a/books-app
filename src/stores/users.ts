import { defineStore } from "pinia";
import { reactive } from "vue";
import { ref, computed } from "vue";
import { supabase } from "@/data/supabase";
import type { BookArray } from "@/types/book";
interface Credentials {
  email: string;
  password: string;
  username: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface Review {
  text: string;
  rating: number;
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
  const isLoading = ref(false);
  const isUserLoading = ref(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    const { email, password } = credentials;

    if (!isValidEmail(email)) {
      return (errorMessage.value = "Email is invalid");
    }
    if (!password.length) {
      return (errorMessage.value = "Password cannot be empty");
    }
    isLoading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      isLoading.value = false;
      return (errorMessage.value = error.message);
    }
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      email: existingUser?.email,
      username: existingUser?.username,
      id: existingUser?.id,
    };
    isLoading.value = false;
    errorMessage.value = "";
  };

  const handleSignup = async (credentials: Credentials) => {
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

    isLoading.value = true;

    const { data: hasUsername } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    if (hasUsername) {
      isLoading.value = false;
      return (errorMessage.value = "User already registered");
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      isLoading.value = false;
      console.log(error);
      return (errorMessage.value = error.message);
    }

    console.log(data);

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
      username: newUser?.username,
    };
    console.log(newUser);

    isLoading.value = false;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };
  const getUser = async () => {
    isUserLoading.value = true;
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      isUserLoading.value = false;
      return (user.value = null);
    }

    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", data?.user?.email)
      .single();

    user.value = {
      username: userWithEmail?.username,
      email: userWithEmail?.email,
      id: userWithEmail?.id,
    };
    isUserLoading.value = false;
  };
  const getUserBook = async (books: BookArray[]) => {
    const { data, error } = await supabase
      .from("users")
      .update({ user_books: JSON.stringify(books) })
      .eq("email", user.value.email);
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  };
  // const getUserReview = async (review: Review) => {
  //   const { data, error } = await supabase
  //     .from("users")
  //     .update({ user_reviews: JSON.stringify(review) })
  //     .eq("email", user.value.email);
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log(data);
  //   }
  // };

  return {
    errorMessage,
    isLoading,
    isUserLoading,
    user,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser,
    getUserBook,
  };
});
export type { Credentials };
