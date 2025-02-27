
<script lang="js" setup>
import { Gradient } from '@/utils/gradient'

onMounted(() => {
    var gradient = new Gradient()
    gradient.initGradient('#gradient-canvas');
})
</script>
<template>

    <canvas id="gradient-canvas" class="w-[100vw] h-[100vh]" ></canvas>
    <div class="
        absolute left-0 top-0 bottom-0 right-0 
        bg-gradient-to-tl from-primary via-primary/80 to-primary/80 
        dark:from-gray-900 dark:via-gray-950/90 dark:to-gray-900/80
    ">
        <!-- Logo -->
        <UContainer class="auth flex items-center justify-center py-5">
            <Logo :light="true" />
        </UContainer>
        
        <!-- Auth Form -->
        <slot />

    </div>

</template>
