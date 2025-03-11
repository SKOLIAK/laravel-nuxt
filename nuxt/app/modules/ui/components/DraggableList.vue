<script lang="ts" setup>
import { Container, Draggable } from "vue3-smooth-dnd";

const emit = defineEmits(["changed"])

const props = defineProps(['items'])

// const items = ref([
//   { id: 1, data: "Princess Mononoke" },
//   { id: 2, data: "Spirited Away" },
//   { id: 3, data: "My Neighbor Totoro" },
//   { id: 4, data: "Howl's Moving Castle" }
// ])

const newItems = ref([])

onBeforeMount(() => {
  newItems.value = props.items.value
}),


function onDrop(dropResult){
  newItems.value = applyDrag(newItems.value, dropResult);
  emit('changed', newItems.value)
}

function applyDrag(arr, dragResult){
  const { removedIndex, addedIndex, payload } = dragResult;

  if (removedIndex === null && addedIndex === null) return arr;
  const result = [...arr];
  let itemToAdd = payload;
  
  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }
  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }
  return result;
}

</script>

<template>
  {{ newItems }}
  <div v-for="group in items">
    <div class="p-2 bg-gray-700">{{ group.name }}</div>
    <Container orientation="vertical" @drop="onDrop">  
      <Draggable v-for="(item, i) in group.tags" key="uno">
        <div class="p-0.5 bg-gray-800 m-0.5 rounded">{{ i + 1 }} - {{item.name}}</div>
      </Draggable>
    </Container>
  </div>     
</template>