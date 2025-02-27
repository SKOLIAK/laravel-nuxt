<script lang="ts" setup>
  const { registerState } = useAuth()
  const router = useRouter();
  const form = ref();

  definePageMeta({
    middleware: ["guest"],
    layout: "auth",
  });

  useSeoMeta({
    title: "Register",
  });

  const { refresh: onSubmit, status: registerStatus } = useFetch<any>("register", {
    method: "POST",
    body: registerState,
    immediate: false,
    watch: false,
    async onResponse({ response }) {
      if (response?.status === 422) {
        form.value.setErrors(response._data?.errors);
      } else if (response._data?.ok) {
        useToast().add({
          icon: GetSuccessIcon,
          title: "You have been registered successfully.",
          color: GetSuccessColor,
          actions: [
            {
              label: "Log In now",
              to: "/auth/login",
              color: GetSuccessColor,
            },
          ],
        });

        router.push("/auth/login");
      }
    },
  });
</script>

<template>
  <UContainer class="mx-auto my-20 w-full max-w-md ring-0 p-1">

    <h1 class="mb-6 font-nunito text-2xl font-medium text-white drop-shadow-sm">
      Welcome aboard 🌊
    </h1>

    <UCard 
      :ui="{
        'background': 'bg-white dark:bg-gradient-to-tr dark:from-gray-800/90 dark:to-gray-900/80',
        'ring': 'border border-black/5 dark:border-white/5'
      }"
      class="mx-auto w-full max-w-md ring-0">
      

      <UForm ref="form" :state="registerState" @submit="onSubmit" class="space-y-4">
        <UFormGroup label="Name" name="name" required>
          <UInput v-model="registerState.name" type="text" autofocus />
        </UFormGroup>

        <UFormGroup label="Email" name="email" required>
          <UInput
            v-model="registerState.email"
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
            trailing
            type="email"
          />
        </UFormGroup>

        <UFormGroup
          label="Password"
          name="password"
          hint="min 8 characters"
          :ui="{ hint: 'text-xs text-gray-500 dark:text-gray-400' }"
          required
        >
          <UInput v-model="registerState.password" type="password" autocomplete="off" />
        </UFormGroup>

        <UFormGroup label="Repeat Password" name="password_confirmation" required>
          <UInput v-model="registerState.password_confirmation" type="password" autocomplete="off" />
        </UFormGroup>

        <div class="flex items-center justify-end space-x-4">
          <UButton type="submit" label="Sign Up" :loading="registerStatus === 'pending'" />
        </div>
      </UForm>

    </UCard>

    
    <div class="text-sm text-center text-primary mt-4 text-white opacity-70 leading-10">
      Already have an account?
      <NuxtLink class="text-sm" to="/auth/login">Login now</NuxtLink>
    </div>
  </UContainer>

</template>
