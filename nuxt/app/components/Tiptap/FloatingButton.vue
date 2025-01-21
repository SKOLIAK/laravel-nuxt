<template>
  <div
    ref="scrollTopButton"
    class="sticky bottom-0 flex w-full items-center justify-end pb-3 pr-5 transition"
  >
    <slot name="content"></slot>
    <UButton ref="floatingButton" v-bind="$attrs" @click.prevent="$emit('clickUpdateDiary')">
      <slot name="button"></slot>
    </UButton>
  </div>
</template>

<script setup>
  let scrollTopButton = ref(null);

  const handleScroll = () => {
    if (window.scrollY >= 0) {
      scrollTopButton.value.classList.remove("invisible");
    } else {
      scrollTopButton.value.classList.add("invisible");
    }
  };

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
</script>
