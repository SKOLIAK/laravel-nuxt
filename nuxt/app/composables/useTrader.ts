import dayjs from 'dayjs'
import { timeZones  } from '@/utils/global';
import { createSharedComposable } from "@vueuse/core";

const _useTrader = () => {
    const auth = useAuthStore()

    const getTimezone = () => {
        return auth.logged ? auth.user.timezone : timeZones.value[0]
    }

    return { getTimezone }

}

export const useTrader = createSharedComposable(_useTrader);
