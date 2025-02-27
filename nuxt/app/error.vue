<script lang="ts" setup>
    import { Gradient } from '@/utils/gradient'
    import type { NuxtError } from "#app";

    const router = useRouter()

    function goBack() {
        return router.go(-1)
    }

    let props = defineProps({
        error: {
        type: Object as PropType<NuxtError>,
        required: true,
        },
    });

    onMounted(() => {
        var gradient = new Gradient()
        gradient.initGradient('#gradient-canvas');
    })

</script>
<template>
<canvas id="gradient-canvas" class="w-[100vw] h-[100vh]" ></canvas>
<section class="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tl from-primary via-primary/80 to-primary/80 
        dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900/80">
    <div class="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div>
            <p class="text-sm font-medium text-white/80 dark:text-primary">
                {{ props.error.statusCode }} error
            </p>

            <h1 class="mt-3 text-2xl font-semibold text-white md:text-3xl">
                <template v-if="props.error.statusCode == 404">
                    We can’t find that page
                </template>
                <template v-else>
                    Something went wrong
                </template>
            </h1>

            <p class="mt-4 text-white/70">
                <template v-if="props.error.statusCode == 404">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </template>
               <template v-else>
                {{ props.error.message }}
               </template>
            </p>

            <div class="flex items-center mt-6 gap-x-3">
                <UButton 
                    size="lg" 
                    color="white" 
                    leading-icon="tabler:arrow-narrow-left-dashed"
                    @click.prevent="goBack"
                >
                    Go back
                </UButton>
                <UButton size="lg" class="!text-white" to="/">Take me home</UButton>
            </div>
        </div>
    </div>
</section>
</template>