<template>
  <main>
    <el-button @click="addNewWidget2">添加仪表</el-button>
    <el-button @click="management">管理仪表</el-button>
    <el-button @click="save">应用</el-button>
    <br />
    <GridDrag dragHandle=".handler" ref="gridDragRef" v-model="items" />

    <Drag :data="items" ref="dragRef" />
  </main>
</template>

<script setup>
import {
  computed,
  watch,
  reactive,
  ref,
  nextTick,
  onMounted,
  shallowRef,
} from 'vue'
import 'gridstack/dist/gridstack.min.css'
import { GridStack } from 'gridstack'
import GridDrag from './components/GridDrag'
import Drag from './components/Drag'

const dragRef = shallowRef(null)

/*let items = ref([
  {
    x: 6,
    y: 0,
    w: 6,
    h: 4,
    id: 1,
    mark: 'grid-item-1',
  },
  { x: 0, y: 0, w: 6, h: 4, id: 2, mark: 'grid-item-2' },
  { x: 6, y: 4, w: 6, h: 4, id: 3, mark: 'grid-item-3' },
  { x: 0, y: 4, w: 6, h: 4, id: 4, mark: 'grid-item-4' },
  { x: 9, y: 8, w: 3, h: 2, id: 5, mark: 'grid-item-5' },
  { x: 6, y: 8, w: 3, h: 2, id: 6, mark: 'grid-item-6' },
  { x: 3, y: 8, w: 3, h: 2, id: 7, mark: 'grid-item-7' },
  { x: 0, y: 8, w: 3, h: 2, id: 8, mark: 'grid-item-8' },
])*/
/*let items = ref([
  {
    w: 6,
    h: 4,
    id: 1,
    mark: 'grid-item-1',
  },
  {
    w: 3,
    h: 2,
    id: 2,
    mark: 'grid-item-2',
  },
])*/
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

const gridDragRef = ref(null)

function addNewWidget2() {
  const id = (items.value.at(-1)?.id || 0) + 1
  const node = {
    // x: 0, // 初始位置 x
    // y: 0, // 初始位置 y
    // autoPosition: true,
    w: id % 2 ? 6 : 3,
    // w: 6,
    h: id % 2 ? 4 : 2,
    // h: 4,
    id,
    mark: `grid-item-${id}`,
  }
  items.value.push(node) // 将新网格项添加到数据数组中
  gridDragRef.value.makeWidget(node.mark)
}

function management() {
  dragRef.value.open()
}

const save = () => {
  gridDragRef.value.save()
}

defineOptions({
  name: 'Kanban',
})
</script>

<style scoped lang="scss"></style>
