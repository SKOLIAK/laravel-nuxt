<script setup lang="ts">
  const { metaSymbol } = useShortcuts();
</script>

<template>
  <div
    data-v-4acf2b7c=""
    class="group mt-3.5 flex items-center rounded-lg border border-white border-opacity-10 bg-white bg-opacity-5 fill-white pr-1 text-white text-opacity-25 transition-all duration-100 ease-in focus-within:border-white focus-within:border-opacity-30 focus-within:text-opacity-100"
  >
    <div data-v-4acf2b7c="" class="m-2 rounded">
      <svg
        data-v-4acf2b7c=""
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          data-v-4acf2b7c=""
          d="M16.875 16.875L13.4388 13.4388M13.4388 13.4388C14.5321 12.3454 15.2083 10.835 15.2083 9.16667C15.2083 5.82995 12.5034 3.125 9.16667 3.125C5.82995 3.125 3.125 5.82995 3.125 9.16667C3.125 12.5034 5.82995 15.2083 9.16667 15.2083C10.835 15.2083 12.3454 14.5321 13.4388 13.4388Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </div>

    <input
      data-v-4acf2b7c=""
      placeholder="Search..."
      class="text-text-white ml-1 flex h-full w-full items-center rounded border-none bg-white bg-opacity-0 text-sm placeholder-white placeholder-opacity-20 outline-none focus:placeholder-opacity-100"
    />

    <span data-v-4acf2b7c="" class="ml-auto flex opacity-40">
      <UKbd
        value="⌘"
        class="ml-1 bg-gray-600/5 text-xs uppercase text-gray-400/50 ring-gray-500/5 transition-all duration-500 group-hover:text-gray-400/80 group-hover:ring-gray-200/10"
      />
      <UKbd
        value="K"
        class="ml-1 bg-gray-600/5 text-xs uppercase text-gray-400/50 ring-gray-500/5 transition-all duration-500 group-hover:text-gray-400/80 group-hover:ring-gray-200/10"
      />
    </span>
  </div>
</template>
