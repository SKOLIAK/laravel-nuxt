<template>
  <Vue3ColorPicker
    class="test"
    v-if="isShow"
    style="width: 270px"
    v-model="color"
    :mode="props.mode"
    :theme="props.theme"
    :show-alpha="props.showAlpha"
    :show-color-list="props.showList"
    :input-type="props.inputType"
    :show-eye-drop="props.showEye"
    :show-input-menu="props.showMenu"
    :color-list-count="16"
    :show-input-set="props.showSet"
    :type="props.type"
    @update:modelValue="handleChange"
    :disabled="props.disabled"
    :showPickerMode="props.showPickerMode"
    :showButtons="props.showButtons"
    gradient-mode="radial"
  />
</template>

<script setup>
  import { Vue3ColorPicker } from "@cyhnkckali/vue3-color-picker";
  import { onMounted, reactive, ref } from "vue";

  import "@cyhnkckali/vue3-color-picker/dist/style.css";
let defProps = defineProps({
  element: '#color-select'
})
  const color = ref(document.querySelector("#color-select").style.background);
  const isShow = ref(true);
  const props = reactive({
    mode: "solid",
    theme: "light",
    type: "HEX",
    inputType: "HSL",
    showButtons: false,
    showAlpha: false,
    showList: false,
    showEye: false,
    showMenu: false,
    showSet: false,
    showPickerMode: false,
    show: true,
    disabled: false,
  });

  const handleChange = () => {
    //document.querySelector("#color-select").style.background = color.value;
  };

  onMounted(() => {
    //document.querySelector("#color-select").style.background = color.value;
  });
</script>

<style>
  .container {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
  }

  .value {
    background-color: rgba(0, 0, 0, 0.308);
    padding: 10px;
    display: inline;
    margin: 15px 10px;
    color: #cecaca;
    border-radius: 10px;
  }

  .test input[type="text"] {
    font-size: 14px !important;
  }

  .test input[type="number"] {
    font-size: 14px !important;
  }
</style>
