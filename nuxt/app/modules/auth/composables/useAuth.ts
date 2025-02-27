import { createSharedComposable } from "@vueuse/core";
import type { Provider } from '@/modules/auth/types'

const _useAuth = () => {
    const route = useRoute()
    const router = useRouter()
    const auth = useAuthStore()
    const config = useRuntimeConfig()

    //** Login providers, such as Google */
    const providers = ref<{ [key: string]: Provider }>(config.public.providers);

    const loginState = reactive({
        email: "",
        password: "",
        remember: false,
    });

    const registerState = reactive({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    watch(
        () => route.fullPath,
        () => {
            // ...
        }
    );

    return {
        providers,
        loginState,
        registerState,
    };
};

export const useAuth = createSharedComposable(_useAuth);
