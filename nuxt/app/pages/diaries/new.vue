<script setup>
  import Highlight from "@tiptap/extension-highlight";
  import Typography from "@tiptap/extension-typography";
  import Underline from "@tiptap/extension-underline";
  import TiptapStarterKit from "@tiptap/starter-kit";
  import { BubbleMenu, FloatingMenu, useEditor } from "@tiptap/vue-3";

  definePageMeta({
    middleware: ["auth"],
  });

  const formData = reactive({
    content: "<h1>📚 Your Diary Starts Here.</h1>",
    flagged: false,
    created: new Date(),
  });

  const editor = useEditor({
    content: formData.content,
    extensions: [TiptapStarterKit, Highlight, Typography, Underline],
    onUpdate({ editor }) {
      formData.content = editor.getHTML().replaceAll("<p></p>", "<p><br></p>");
    },
  });

  onBeforeUnmount(async () => {
    unref(editor).destroy();
  });

  const { refresh: createDiary, status: userDiaryCreate } = useFetch("diaries", {
    method: "POST",
    body: formData,
    immediate: false,
    watch: false,
    async onResponse({ response }) {
      if (response._data?.ok) {
        useToast().add({
          icon: GetSuccessIcon,
          title: response._data.message,
          color: GetSuccessColor,
        });
      }
    },
  });
</script>
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="New Diary" class="bg-white">
        <template #right>
          <!-- Actions ... -->
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="bg-white">
        <template #left>
          <!-- -->
        </template>
        <template #right>
          <!-- -->
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <div v-if="editor">
          <bubble-menu
            class="rounded-lg border border-gray-50 bg-white p-1 shadow-xl dark:border-gray-800 dark:bg-black dark:shadow-black/50"
            :tippy-options="{ duration: 100 }"
            :editor="editor"
          >
            <TiptapAction
              :editor="editor"
              @click="editor.chain().focus().toggleBold().run()"
              :disabled="!editor.can().chain().focus().toggleBold().run()"
              name="bold"
            >
              <svg
                class="h-4 w-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"
                />
              </svg>
            </TiptapAction>

            <TiptapAction
              :editor="editor"
              @click="editor.chain().focus().toggleItalic().run()"
              :disabled="!editor.can().chain().focus().toggleItalic().run()"
              name="italic"
            >
              <svg
                class="h-4 w-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m8.874 19 6.143-14M6 19h6.33m-.66-14H18"
                />
              </svg>
            </TiptapAction>

            <TiptapAction
              :editor="editor"
              @click="editor.chain().focus().toggleUnderline().run()"
              :disabled="!editor.can().chain().focus().toggleUnderline().run()"
              name="underline"
            >
              <svg
                class="h-4 w-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4"
                />
              </svg>
            </TiptapAction>

            <button
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            >
              H1
            </button>
            <button
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            >
              H2
            </button>
            <button
              @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            >
              H3
            </button>
            <button
              @click="editor.chain().focus().toggleBulletList().run()"
              :class="{ 'is-active': editor.isActive('bulletList') }"
            >
              Bullet list
            </button>
          </bubble-menu>
        </div>

        <TiptapEditorContent
          :editor="editor"
          class="diary block w-full border-0 bg-white px-0 py-2 text-sm text-gray-800 focus:ring-0 dark:bg-transparent dark:text-white dark:placeholder-gray-400"
        />

        <TiptapFloatingButton
          icon="octicon:checklist-16"
          @clickUpdateDiary="createDiary"
          class="ml-4"
          label="Create"
          :loading="userDiaryCreate === 'pending'"
        >
          <template #content>
            <div class="select-none text-xs font-medium text-gray-500 dark:text-white/20">
              Action 1
            </div>
            <div class="ml-2 px-3 py-2">Action 2</div>
          </template>
          <template #button> Save Diary </template>
        </TiptapFloatingButton>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
