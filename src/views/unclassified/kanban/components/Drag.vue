<template>
  <DrawerTab @close="close" ref="drawerTabRef">
    <el-button @click="save">应用</el-button>
    <el-button @click="close">重置</el-button>
    <div class="drag-content">
      <GridDrag
        margin="5"
        cellHeight="20"
        boxCls="a"
        ref="gridDragRef"
        v-model:dragData="rightData"
        v-model="items" />
      <div class="sidebar">
        {{ rightData }}
        <!-- will size to match content -->
        <div
          v-for="item of rightData"
          class="grid-stack-item"
          :gs-id="item.id"
          :gs-w="item.w"
          :gs-h="item.h"
          :key="item.id">
          <div class="grid-stack-item-content">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </DrawerTab>
</template>

<script setup>
import {
  computed,
  watch,
  reactive,
  ref,
  onMounted,
  shallowRef,
  nextTick,
} from 'vue'
import GridDrag from './GridDrag'
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
let items = ref([
  {
    w: 6,
    h: 4,
    id: 1,
    mark: 'grid-item-1',
    // 禁用元素大小调整
    // resize: false,
    // 另一个元素在拖动或调整大小不会改变当前元素位置
    // locked: false,
    // 禁止移动
    // move: false,
  },
  {
    w: 3,
    h: 2,
    id: 2,
    mark: 'grid-item-2',
    x: 9,
    y: 0,
  },
  {
    w: 6,
    h: 4,
    id: 3,
    mark: 'grid-item-3',
  },
  {
    w: 3,
    h: 2,
    id: 4,
    mark: 'grid-item-4',
    x: 0,
    y: 4,
  },
])

let rightData = ref([
  {
    id: 101,
    w: 6,
    h: 4,
    title: '测试1',
  },
  {
    id: 102,
    w: 6,
    h: 4,
    title: '测试2',
  },
])

const gridDemoRef = ref(null)
const drawerTabRef = shallowRef(null)
const gridDragRef = shallowRef(null)
const open = () => {
  drawerTabRef.value.open()
  nextTick(() => {
    gridDragRef.value.setDrag()
  })
}
const close = () => {
  items.value = [
    {
      w: 6,
      h: 4,
      id: 1,
      mark: 'grid-item-1',
      // 禁用元素大小调整
      // resize: false,
      // 另一个元素在拖动或调整大小不会改变当前元素位置
      // locked: false,
      // 禁止移动
      // move: false,
    },
    {
      w: 3,
      h: 2,
      id: 2,
      mark: 'grid-item-2',
      x: 9,
      y: 0,
    },
    {
      w: 6,
      h: 4,
      id: 3,
      mark: 'grid-item-3',
    },
    {
      w: 3,
      h: 2,
      id: 4,
      mark: 'grid-item-4',
      x: 0,
      y: 4,
    },
  ]
  rightData.value = [
    {
      id: 101,
      w: 6,
      h: 4,
      title: '测试1',
    },
    {
      id: 102,
      w: 6,
      h: 4,
      title: '测试2',
    },
  ]
}
const save = () => {
  gridDragRef.value.save()
}

defineExpose({
  open,
})

defineOptions({
  name: 'Drag',
})
</script>

<style scoped lang="scss">
.drag-content {
  display: flex;
  min-height: 500px;
  overflow: hidden;
  background-color: $color-fff;
  border: 1px solid #e3e5ed;
  border-radius: 4px;
  > div {
    flex: 1;
    padding: 12px 24px;
    &:first-of-type {
    }
  }
}
</style>
