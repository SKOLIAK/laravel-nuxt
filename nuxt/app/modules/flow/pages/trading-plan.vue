<script setup>
import { ref } from 'vue'
import { Position, VueFlow, useVueFlow } from '@vue-flow/core'
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

const { 
  fetchFlow,
  saveFlow,
  edges,
  nodes,
  getViewport, 
  setViewport, 
  selectedElement, 
  isSaving,
  isLocked, 
  lockUnlock, 
  getNodeIcon,
  activeSidebarItem
} = useFlow()

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()


/**
 * `useVueFlow` provides:
 * 1. a set of methods to interact with the VueFlow instance (like `fitView`, `setViewport`, `addEdges`, etc)
 * 2. a set of event-hooks to listen to VueFlow events (like `onInit`, `onNodeDragStop`, `onConnect`, etc)
 * 3. the internal state of the VueFlow instance (like `nodes`, `edges`, `viewport`, etc)
 */
const { 
  onInit, 
  onNodeDragStop, 
  onNodeClick,
  onEdgeClick,
  onConnect, 
  addEdges, 
  onEdgesChange,
  onNodesChange,
  toObject, 
  getIntersectingNodes, 
  isNodeIntersecting, 
  updateNode, 
  screenToFlowCoordinate 
} = useVueFlow()


onBeforeMount(async () => {
  await fetchFlow()
})

onInit((vueFlowInstance) => {
  // instance is the same as the return of `useVueFlow`
 if(!getViewport.value) {
    vueFlowInstance.fitView()
  } else {
    vueFlowInstance.setViewport(JSON.parse(getViewport.value))
  }
  
})

const updateFlowData = async (edges, nodes) => {
  await saveFlow(edges, nodes)
}

const settingsDisabled = computed(() => {
  return isObjectEmpty(selectedElement.value)
})

const sidebarItems = ref([
  {
    label: 'Nodes',
    icon: 'i-lucide-star',
  },
  {
    label: 'Settings',
    icon: 'i-lucide-lock',
    disabled: settingsDisabled
  }
])



onNodeClick(({ event, node }) => {
  if(!isLocked.value) {
    selectedElement.value = node
    debug('Node clicked: ' + JSON.stringify(node) + ' Event: ' + JSON.stringify(event));
    activeSidebarItem.value = 1
  }
});


onEdgeClick(({ event, edge }) => {
  if(!isLocked.value) {
    selectedElement.value = edge
    log('Edge clicked:', edge, event);
    activeSidebarItem.value = 1
  }
});


/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 * Any event that is available as `@event-name` on the VueFlow component is also available as `onEventName` on the composable and vice versa
 *
 * onInit is called when the VueFlow viewport is initialized
 */

watch(toObject, (a, b) => {
  setViewport(a.viewport)
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
  log('Node Drag Stop', { event, nodes, node })
})

/**
 * onConnect is called when a new connection is created.
 *
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether by not calling `addEdges`
 */
onConnect((connection) => {
  addEdges({ ...connection, ...{ style: { stroke: theme.colors.gray[400] }}, animated: false})
})

/**
 * toObject transforms your current graph data to an easily persist-able object
 */
function logToObject() {
  log(JSON.stringify(toObject().nodes))
  console.warn(JSON.stringify(toObject().edges))
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
    
    <div class="absolute top-3 right-3 text-orange-500 ring-1 ring-inset ring-orange-500 bg-orange-200/30 dark:bg-orange-950 rounded px-1.5 py-0.5 gap-x-1 flex items-center font-bold text-xs" v-if="isLocked">
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
        <div class="flex flex-col">
          <UTooltip text="Log `toObject`" :popper="{ placement: 'right'}">
            <ControlButton @click="logToObject">
              <UIcon name="unjs:h3" />
            </ControlButton>
          </UTooltip>

          <UTooltip text="Test Button" :popper="{ placement: 'right'}">
            <ControlButton>
              🌊
            </ControlButton>
          </UTooltip>
        </div>
        
      </Controls>
    </VueFlow>
    </div>



</UDashboardContent>


<!-- Sidebar -->
<UDashboardPanel side="right" :width="300" :resizable="{min: 300, max: 600}">
  <UDashboardPanelContent>
    
    <div class="p-4">
      <UButton variant="soft" 
        @click="updateFlowData(toObject().edges, toObject().nodes)" 
        :loading="isSaving" 
        :disabled="isSaving || isLocked"
        label="Save"
        leading-icon="lucide:save"
      />

    </div>
    
    <UDivider class="my-2" />


    <aside class="p-4 pt-2">

      <UTabs :items="sidebarItems" v-model="activeSidebarItem" class="w-full" />








      <template v-if="activeSidebarItem == 1 && selectedElement">

        <FEditableNodeCard 
            v-if="selectedElement.type != 'default'"
            :id="selectedElement.id"
            :title="selectedElement.data.label"
          />


          <!-- Edge Settings -->
          <div class="flex flex-col gap-y-3 w-full" v-if="selectedElement.type == 'default'">
            <h3 class="text-foreground font-medium mb-4">
              Customise this connection
            </h3>
            <div class="flex items-center justify-between">
              <UPopover>
                <div class="flex items-center gap-x-2">
                  <span class="text-foreground/70">Color:</span>
                  <button>
                    <div class="color-select" id="color-select" :style="{ 'background-color': selectedElement.style.stroke }">
                      <span class="drop-shadow">{{ selectedElement.style.stroke }}</span>
                    </div>
                  </button>
                </div>
                <template #panel>
                  <UColorPicker v-model="selectedElement.style.stroke" />
                </template>
              </UPopover>
              <UCheckbox label="Animated?" v-model="selectedElement.animated" class="ms-auto" />
            </div>
            <UDivider />
            <div>
              <UButton color="white" @click="selectedElement = null; activeSidebarItem = 0">Done</UButton>
            </div>
            
          </div>





      </template>
      <template v-else>
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
      </template>
    </aside>




  </UDashboardPanelContent>
</UDashboardPanel>
</template>