<script lang="ts" setup>
  definePageMeta({
    // middleware: ["guest"],
    layout: "auth",
  });

  useSeoMeta({
    title: "Recover Password",
  });

  const form = ref();

  const state = reactive({
    email: "",
  });

  const { refresh: onSubmit, status: forgotStatus } = useFetch<any>("forgot-password", {
    method: "POST",
    body: state,
    immediate: false,
    watch: false,
    async onResponse({ response }) {
      if (response?.status === 422) {
        form.value.setErrors(response._data?.errors);
      } else if (response._data?.ok) {
        useToast().add({
          title: "Success",
          description: response._data.message,
          color: GetSuccessColor,
        });
      }
    },
  });
</script>

<template>
  <UContainer class="mx-auto my-20 w-full max-w-md ring-0 p-1">

    <h1 class="mb-6 font-nunito text-2xl font-medium text-white drop-shadow-sm">
      Let's get that password sorted 💪
    </h1>

    <UCard 
      :ui="{
        'background': 'bg-white dark:bg-gradient-to-tr dark:from-gray-800/90 dark:to-gray-900/80',
        'ring': 'border border-black/5 dark:border-white/5'
      }"
      class="mx-auto w-full max-w-md ring-0">
      
      <UForm ref="form" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormGroup label="Email" name="email" required>
          <UInput
            v-model="state.email"
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
            trailing
            type="email"
            autofocus
          />
        </UFormGroup>

        <div class="flex items-center justify-end space-x-4">
          <UButton type="submit" label="Recover password" :loading="forgotStatus === 'pending'" />
        </div>
      </UForm>
    </UCard>


    <div class="text-sm text-center mt-4 text-white opacity-70 leading-10">
      <NuxtLink class="text-sm" to="/auth/login">Take me back to the <span class="underline">Login page</span></NuxtLink>
    </div>
  </UContainer>

</template>
