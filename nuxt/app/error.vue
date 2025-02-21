<script setup lang="ts">
    import type { NuxtError } from "#app";
    import { Gradient } from '@/utils/gradient'


    onMounted(() => {
        var gradient = new Gradient()
        gradient.initGradient('#gradient-canvas');
    })

    const router = useRouter()

    useSeoMeta({
        title: "Page not found",
        description: "We are sorry but this page could not be found.",
    });

    let props = defineProps({
        error: {
        type: Object as PropType<NuxtError>,
        required: true,
        },
    });

    useHead({
        htmlAttrs: {
        lang: "en",
        },
    });

  console.log(props.error)
</script>

<template>

<canvas id="gradient-canvas" class="w-[100vw] h-[100vh]" ></canvas>
<div class="absolute left-0 top-0 bottom-0 right-0 bg-gradient-to-tl from-gray-900 via-gray-900 to-gray-900/80">
    <section class="">
        <div class="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
            <div class="wf-ull lg:w-1/2">
                <p class="text-sm font-medium text-primary dark:text-primary">{{ props.error.statusCode }} {{ props.error.name }}</p>
                <h1 class="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">{{ props.error.message }}</h1>
                <p class="mt-4 text-gray-500 dark:text-gray-400">Sorry about that. Here are some helpful links:</p>

                <div class="flex items-center mt-6 gap-x-3">
                    <button @click="router.back()" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:rotate-180">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                        </svg>


                        <span>Go back</span>
                    </button>

                    <NuxtLink to="/" class="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-primary rounded-lg shrink-0 sm:w-auto hover:bg-primary dark:hover:bg-bprimary dark:bg-primary/90">
                        Take me home
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</div>
</template>
