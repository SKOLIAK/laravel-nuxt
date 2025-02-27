import dayjs from 'dayjs'
import { createSharedComposable } from "@vueuse/core";

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const config = useRuntimeConfig()

  /**
   * Greets user based on time of day
   * @param param Username to greet
   * @returns String
   */
  const GreetUser = (param: string) => {
    const currentTime = +dayjs().format("HH");

    const emojis = [
      '👋', '😉', '😎', '👽', '🫡'
    ];

    if (String(param).length) {
      param = ", " + param
    }

    if (currentTime >= 6 && currentTime < 12) {
      return "Good morning" + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
    } else if (currentTime >= 12 && currentTime < 18) {
      return "Good afternoon" + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
    } else if (currentTime >= 18 && currentTime < 22) {
      return "Good evening" + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
    } else {
      return "Good night" + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
    }
  }

  watch(
    () => route.fullPath,
    () => {
      // ...
    }
  );

  return { GreetUser };
};

export const useDashboard = createSharedComposable(_useDashboard);
