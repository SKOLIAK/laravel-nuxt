<script lang="ts" setup>
  const { loginState, providers } = useAuth()
  const config = useRuntimeConfig()
  const router = useRouter();
  const auth = useAuthStore();
  const form = ref();

  definePageMeta({
    middleware: ["guest"],
    layout: "auth",
  });

  useSeoMeta({
    title: "Log In",
  });

  const { refresh: onSubmit, status: loginStatus } = useFetch<any>("login", {
    method: "POST",
    body: loginState,
    immediate: false,
    watch: false,
    async onResponse({ response }) {
      if (response?.status === 422) {
        form.value.setErrors(response._data?.errors);
      } else if (response._data?.ok) {
        auth.token = response._data.token;

        await auth.fetchUser();
        await router.push("/");
      }
    },
  });

  async function handleMessage(event: { data: any }): Promise<void> {
    const provider = event.data.provider as string;

    if (Object.keys(providers.value).includes(provider) && event.data.token) {
      providers.value[provider].loading = false;
      auth.token = event.data.token;

      await auth.fetchUser();
      await router.push("/");
    } else if (event.data.message) {
      useToast().add({
        icon: GetErrorIcon,
        color: GetErrorColor,
        title: event.data.message,
      });
    }
  }

  function loginVia(provider: string): void {
    providers.value[provider].loading = true;

    const width = 640;
    const height = 660;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    console.warn(`${config.public.apiBase}${config.public.apiPrefix}/login/${provider}/redirect`)
    const popup = window.open(
      `${config.public.apiBase}${config.public.apiPrefix}/login/${provider}/redirect`,
      "Sign In",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scollbars=no, resizable=no, copyhistory=no, width=${width},height=${height},top=${top},left=${left}`
    );

    const interval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(interval);
        providers.value[provider].loading = false;
      }
    }, 500);
  }

  onMounted(() => window.addEventListener("message", handleMessage));
  onBeforeUnmount(() => window.removeEventListener("message", handleMessage));
</script>

<template>
  <UContainer class="mx-auto my-20 w-full max-w-md ring-0 p-1">

    <h1 class="mb-6 font-nunito text-2xl font-medium text-white drop-shadow-sm">
      Hey, there 👋
    </h1>

    <UCard 
      :ui="{
        'background': 'bg-white dark:bg-gradient-to-tr dark:from-gray-800/90 dark:to-gray-900/80',
        'ring': 'border border-black/5 dark:border-white/5'
      }"
      class="mx-auto w-full max-w-md ring-0">
      
      <template v-if="Object.keys(providers).length">
        <div class="flex gap-4">
          <UButton
            v-for="(provider, key) in providers"
            :key="key"
            :loading="provider.loading"
            :icon="provider.icon"
            :color="provider.color"
            :label="provider.name"
            size="lg"
            class="flex w-full items-center justify-center"
            @click="loginVia(key as string)"
          />
        </div>

        <UDivider label="OR" class="my-4" />
      </template>

      <UForm ref="form" :state="loginState" @submit="onSubmit" class="space-y-4">
        <UFormGroup label="Email" name="email" required>
          <UInput
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
            trailing
            type="email"
             v-model="loginState.email"
            autofocus
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password" required>
          <UInput type="password" v-model="loginState.password" />
        </UFormGroup>

        <UTooltip text="for 1 month" :popper="{ placement: 'right' }">
          <UCheckbox  label="Remember me" v-model="loginState.remember"/>
        </UTooltip>

        <div class="flex items-center justify-between space-x-4 text-sm">
          <NuxtLink class="text-sm hover:underline" to="/auth/forgot">Forgot your password?</NuxtLink>
          <UButton type="submit" label="Login" :loading="loginStatus == 'pending'" />
        </div>
      </UForm>

    </UCard>


    <div class="text-sm text-center mt-4 text-white opacity-70 leading-10">
      Don't have an account yet?
      <NuxtLink class="text-sm underline" to="/auth/register">Register now</NuxtLink>
    </div>
  </UContainer>

</template>
