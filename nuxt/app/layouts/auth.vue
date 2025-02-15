
<script lang="js" setup>
import { Gradient } from '@/utils/gradient'

onMounted(() => {
    var gradient = new Gradient()
    gradient.initGradient('#gradient-canvas');
})
</script>
<template>

    <canvas id="gradient-canvas" class="w-[100vw] h-[100vh]" ></canvas>
    <div class="absolute left-0 top-0 bottom-0 right-0 bg-gradient-to-tl from-gray-900 via-gray-900 to-gray-900/80">
        <UContainer class="auth flex items-center justify-center py-5">
            <AppLogo />
        </UContainer>
        <slot />
    </div>

</template>

<style lang="css">
    #gradient-canvas {
        --gradient-color-1: theme('colors.teal.200');
        --gradient-color-2: theme('colors.teal.500');
        --gradient-color-3: theme('colors.teal.800');
        --gradient-color-4: theme('colors.gray.800');
    }
</style>
