export const getSavedColors = typeof localStorage !== "undefined" ? ref(localStorage.getItem("savedColorPickerColors")) : ref([]);

if (!getSavedColors.value) {
  getSavedColors.value = []
}

export function addSavedColor(_color) {
  if (getSavedColors.value.includes(_color)) { return; }
  getSavedColors.value.push(_color)
  localStorage.setItem("savedColorPickerColors", getSavedColors.value)
}