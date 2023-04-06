import { ref } from "vue";

export const useCopyToClipboard = () => {
  const copied = ref(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    copied.value = true;

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  };

  return { copyToClipboard, copied };
};
