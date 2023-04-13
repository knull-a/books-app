import { defineStore } from "pinia";
import { ref, watch } from "vue";
export const useUserAvatarStore = defineStore("profileAvatars", () => {
  const profileAvatars = ref<string>("");

  if(localStorage.getItem("profileAvatars")) {
    profileAvatars.value = JSON.parse(localStorage.getItem("profileAvatars") as string)
  }

  watch(profileAvatars, (val) => {
    localStorage.setItem("profileAvatars", JSON.stringify(val));
  });

  return {profileAvatars}
});
