<script lang="ts" setup>
const props = defineProps(["modelValue", "entity", "accept", "maxSize", "width", "height"]);
const emit = defineEmits(["update:modelValue"]);

const { $storage } = useNuxtApp();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const inputRef = ref();
const loading = ref(false);
const showCancel = ref(false);

const onSelect = async (e: any) => {
  const file = e.target.files[0];
  e.target.value = null;

  if (file.size > props.maxSize * 1024 * 1024) {
    return useToast().add({
      title: "File is too large.",
      color: GetErrorColor,
      icon: GetErrorIcon,
    });
  }

  showCancel.value = false;
  loading.value = true;

  const formData = new FormData();
  formData.append("image", file);

  await $fetch<any>("upload", {
    method: "POST",
    body: formData,
    params: {
      entity: props.entity,
      width: props.width ?? null,
      height: props.height ?? null,
    },
    ignoreResponseError: true,
    onResponse({ response }) {
      if (response.status !== 200) {
        useToast().add({
          icon: GetErrorIcon,
          color: GetErrorColor,
          title: response._data?.message ?? response.statusText ?? 'Something went wrong',
        });
      } else if (response._data?.ok) {
        value.value = response._data?.path;
        showCancel.value = true
      }

      loading.value = false;
    },
  });
};
</script>

<template>
  <div class="flex gap-6">
    <div class="relative flex gap-x-2">
      <UPopover mode="hover">
        <UButton
          type="button"
          color="white"
          icon="i-heroicons-cloud-arrow-up"
          size="xs"
          :loading="loading"
          @click="inputRef.click()"
        >
          Add Screenshot
        </UButton>
        <template #panel>
          <div class="text-xs bg-white p-2">
            <div>Max upload size: {{ maxSize }}Mb</div>
            <div>Accepted formats: {{ accept }}</div>
          </div>
        </template>
      </UPopover>
        <UButton
          type="button"
          color="black"
          icon="i-heroicons-x-mark-20-solid"
          size="2xs"
          :disabled="loading"
          @click="value = ''"
          v-if="showCancel"
        />

      <input
        ref="inputRef"
        type="file"
        class="hidden"
        :accept="accept"
        @change="onSelect"
      />
    </div>
  </div>
</template>
