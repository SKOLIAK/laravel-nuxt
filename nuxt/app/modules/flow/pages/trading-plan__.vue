<script setup>
import { ref } from 'vue'
import { Position, VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

definePageMeta({
    middleware: ['auth'],
})

const appConfig = useAppConfig();
import tailwindConfig from "@/tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
const { theme } = resolveConfig(tailwindConfig);

import useDragAndDrop from '#flow/composables/useDragAndDrop'
import { FCanvasNode } from '#components'

const { viewport, isLocked, lockUnlock, getNodeIcon } = useFlow()

const { onDragStart, onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()


/**
 * `useVueFlow` provides:
 * 1. a set of methods to interact with the VueFlow instance (like `fitView`, `setViewport`, `addEdges`, etc)
 * 2. a set of event-hooks to listen to VueFlow events (like `onInit`, `onNodeDragStop`, `onConnect`, etc)
 * 3. the internal state of the VueFlow instance (like `nodes`, `edges`, `viewport`, etc)
 */
const { onInit, onNodeDragStop, onConnect, addEdges, setViewport, toObject, getIntersectingNodes, isNodeIntersecting, updateNode, screenToFlowCoordinate } = useVueFlow()



const nodes = ref([
  {
    id: '1',
    type: '__entry',
    data: { label: 'Is News Day?' },
    position: { x: 150, y: -100 },
    outputPosition: Position.Bottom
  },
  {
    id: '2',
    type: '__true',
    data: { label: 'Yes' },
    position: { x: 350, y: 114 },
  },
  {
    id: '3',
    type: '__false',
    data: { label: 'No' },
    position: { x: 50, y: 114 },
  },
  {
    id: '4',
    type: '__output',
    data: { label: 'Something else' },
    position: { x: 50, y: 214 },
  },
])

const edges = ref([
{
    id: 'e1a-2',
    source: '1',
    sourceHandle: 'output',
    target: '3',
    style: {
      stroke: theme.colors.green[600],
    },
    animated: true,
  },  
  {
    id: 'e1a-sa2',
    source: '1',
    sourceHandle: 'output',
    target: '2',
    style: {
      stroke: theme.colors.gray[500],
    },
    
  },
])

/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 * Any event that is available as `@event-name` on the VueFlow component is also available as `onEventName` on the composable and vice versa
 *
 * onInit is called when the VueFlow viewport is initialized
 */
onInit((vueFlowInstance) => {
  // instance is the same as the return of `useVueFlow`
  vueFlowInstance.fitView()
})

/**
 * onNodeDragStop is called when a node is done being dragged
 *
 * Node drag events provide you with:
 * 1. the event object
 * 2. the nodes array (if multiple nodes are dragged)
 * 3. the node that initiated the drag
 * 4. any intersections with other nodes
 */
onNodeDragStop(({ event, nodes, node }) => {
  console.log('Node Drag Stop', { event, nodes, node })
})

/**
 * onConnect is called when a new connection is created.
 *
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether by not calling `addEdges`
 */
onConnect((connection) => {
  addEdges(connection)
})

/**
 * toObject transforms your current graph data to an easily persist-able object
 */
function logToObject() {
  console.log(toObject())
}


const sidebarNodes = ref([
{
    id: 'entry',
    icon: getNodeIcon('entry'),
    title: 'Entry Node',
    subtitle: 'Starting node of your flow',
  },
  {
    id: 'input',
    icon: getNodeIcon('input'),
    title: 'Condition Node',
    subtitle: 'Add a condition to your flow',
  },
  {
    id: 'true',
    icon: getNodeIcon('true'),
    title: 'True Node',
    subtitle: 'Condition is true',
  },
  {
    id: 'false',
    icon: getNodeIcon('false'),
    title: 'False Node',
    subtitle: 'Condition is false',
  },
  {
    id: 'output',
    icon: getNodeIcon('output'),
    title: 'Outcome Node',
    subtitle: 'Outcome of a condition',
  },
  {
    id: 'group',
    icon: getNodeIcon('group'),
    title: 'Group Node',
    subtitle: 'Group your nodes (Work In Progress)', // WIP
  },
])


</script>

<template>

  <UDashboardContent>
    
    <div class="absolute top-2 right-2 text-cyan-500 font-bold">
      {{ viewport }}
    </div>
    <div class="absolute top-3 right-3 text-rose-500 ring-1 ring-inset ring-rose-500 bg-rose-200/30 dark:bg-rose-950/30 rounded px-1.5 py-0.5 gap-x-1 flex items-center font-bold text-xs" v-if="isLocked">
      <UIcon name="lucide:lock" /> Locked
    </div>


    <div class="dnd-flow">
      <VueFlow 
        :nodes="nodes"
        :edges="edges"
        :default-viewport="{ zoom: 1 }"
        :min-zoom="0.2"
        :max-zoom="4"
        @dragover="onDragOver" 
        @dragleave="onDragLeave"
        @drop="onDrop"
      >
        <FDropzoneBackground
          :class="{'active': isDragOver}"
          :style="{
            transition: 'background-color 0.2s ease',
          }"
        >
          <p v-if="isDragOver">Drop here</p>
        </FDropzoneBackground>
      

      <MiniMap />

      <template #node-__entry="props">
        <FCanvasNode :id="props.id" :data="props.data" :type="props.type" :selected="props.selected" :source="true"/>
      </template>

      <template #node-__input="props">
        <FCanvasNode :id="props.id" :data="props.data" :type="props.type" :selected="props.selected" :source="true" :target="true"/>
      </template>

      <template #node-__true="props">
        <FCanvasNode :id="props.id" :data="props.data" :type="props.type" :selected="props.selected" :source="true" :target="true"/>
      </template>

      <template #node-__false="props">
        <FCanvasNode :id="props.id" :data="props.data" :type="props.type" :selected="props.selected" :source="true" :target="true"/>
      </template>

      <template #node-__group="props">
        <FResizableNode :data="props.data" />
      </template>

      <template #node-__output="props">
        <FCanvasNode :id="props.id" :data="props.data" :type="props.type" :selected="props.selected" :target="true"/>
      </template>


      <template #edge-default="props">
        <FCustomEdge v-bind="props" />
      </template>

      <Controls position="top-left" @interaction-change="lockUnlock">
        <ControlButton title="Log `toObject`" @click="logToObject">
          <UIcon name="unjs:h3" />
        </ControlButton>
      </Controls>
    </VueFlow>

    </div>




</UDashboardContent>


<!-- Sidebar -->
<UDashboardPanel side="right" :width="300" :resizable="{min: 300, max: 600}">
  <UDashboardPanelContent>
    <div class="p-4">
      <UButton variant="soft">Save</UButton>
    </div>
    
    <UDivider class="my-2" />
    <aside class="p-4 pt-2">
      <div class="text-foreground/70 text-xs mb-4">
        You can drag these nodes to the pane.
      </div>

      <div class="flex flex-col gap-2 w-full">

        <!-- Render sidebar nodes -->
        <FNodeCard 
          v-for="node in sidebarNodes"
          :id="node.id"
          :title="node.title"
          :icon="node.icon"
          :icon-color="node.iconColor"
          :subtitle="node.subtitle"
        />

      </div>



    </aside>




  </UDashboardPanelContent>
</UDashboardPanel>
</template>