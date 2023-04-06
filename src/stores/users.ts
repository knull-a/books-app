import { defineStore } from "pinia";
import { reactive } from "vue";
import { ref, computed } from "vue";

interface credentials {
  email: string;
  password: string;
  username: string;
}

export const useUserStore = defineStore("user", () => {
  const isValidEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const user = ref(null);
  const errorMessage = reactive<credentials>({
    email: "Must be a valid e-mail",
    password: "Password needs to be at least 8 characters",
    username: "Username needs to be at least 4 characters",
  });

  const handleLogin = () => {};
  const handleSignup = (credentials: credentials) => {
    const { email, password, username } = credentials;
  };

  const handleLogout = () => {};
  const getUser = () => {};

  return {
    user,
    errorMessage,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser,
  };
});
export type { credentials };
