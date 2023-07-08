<template>
  <div>
    <div class="layout-json">
      Displayed as <code>[x, y, w, h]</code>:
      <div class="columns">
        <div v-for="item in layout" :key="item.i" class="layout-item">
          <b>{{ item.i }}</b
          >: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
        </div>
      </div>
    </div>
    <br />
    <div
      class="droppable-element"
      draggable="true"
      unselectable="on"
      @drag="drag"
      @dragend="dragEnd">
      Droppable Element (Drag me!)
    </div>
    <div ref="wrapper">
      <GridLayout
        ref="gridLayout"
        v-model:layout="layout"
        isBounded
        :margin="[20, 20]"
        :row-height="90">
        <template #item="{ item }">
          <span class="text">{{ item.i }}</span>
        </template>
      </GridLayout>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// you can import from 'lodash-es' or implement it by yourself
import { throttle } from 'lodash-es'

import { GridLayout } from 'grid-layout-plus'

const layout = ref(
  [
    {
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      i: '289',
      id: 289,
      type: 1,
    },
    {
      x: 6,
      y: 1,
      w: 6,
      h: 4,
      i: '2083',
      id: 2083,
      type: 2,
    },
    {
      x: 0,
      y: 1,
      w: 6,
      h: 4,
      i: '2088',
      id: 2088,
      type: 2,
    },
    {
      x: 6,
      y: 5,
      w: 6,
      h: 4,
      i: '2092',
      id: 2092,
      type: 2,
    },
    {
      x: 0,
      y: 5,
      w: 6,
      h: 4,
      i: '2099',
      id: 2099,
      type: 2,
    },
    {
      x: 6,
      y: 9,
      w: 3,
      h: 2,
      i: '2100',
      id: 2100,
      type: 2,
    },
    {
      x: 0,
      y: 9,
      w: 6,
      h: 4,
      i: '2101',
      id: 2101,
      type: 2,
    },
  ].map((item) => ({
    ...item,
    'min-h': item.h,
    'min-w': item.w,
    'max-w': item.w,
  })),
)

const wrapper = ref()
const gridLayout = ref()

onMounted(() => {
  document.addEventListener('dragover', syncMousePosition)
})

onBeforeUnmount(() => {
  document.removeEventListener('dragover', syncMousePosition)
})

const mouseAt = { x: -1, y: -1 }

function syncMousePosition(event) {
  mouseAt.x = event.clientX
  mouseAt.y = event.clientY
}

const dropId = 'drop'
const dragItem = { x: -1, y: -1, w: 2, h: 2, i: '' }

const drag = throttle(() => {
  const parentRect = wrapper.value?.getBoundingClientRect()

  if (!parentRect || !gridLayout.value) return

  const mouseInGrid =
    mouseAt.x > parentRect.left &&
    mouseAt.x < parentRect.right &&
    mouseAt.y > parentRect.top &&
    mouseAt.y < parentRect.bottom

  if (mouseInGrid && !layout.value.find((item) => item.i === dropId)) {
    layout.value.push({
      x: (layout.value.length * 2) % 12,
      y: layout.value.length + 12, // puts it at the bottom
      w: 2,
      h: 2,
      i: dropId,
    })
  }

  const index = layout.value.findIndex((item) => item.i === dropId)

  if (index !== -1) {
    const item = gridLayout.value.getItem(dropId)

    if (!item) return

    try {
      item.wrapper.style.display = 'none'
    } catch (e) {
      console.log(e)
    }

    Object.assign(item.state, {
      top: mouseAt.y - parentRect.top,
      left: mouseAt.x - parentRect.left,
    })
    const newPos = item.calcXY(
      mouseAt.y - parentRect.top,
      mouseAt.x - parentRect.left,
    )

    if (mouseInGrid) {
      gridLayout.value.dragEvent(
        'dragstart',
        dropId,
        newPos.x,
        newPos.y,
        dragItem.h,
        dragItem.w,
      )
      dragItem.i = String(index)
      dragItem.x = layout.value[index].x
      dragItem.y = layout.value[index].y
    } else {
      gridLayout.value.dragEvent(
        'dragend',
        dropId,
        newPos.x,
        newPos.y,
        dragItem.h,
        dragItem.w,
      )
      layout.value = layout.value.filter((item) => item.i !== dropId)
    }
  }
})

function dragEnd() {
  const parentRect = wrapper.value?.getBoundingClientRect()

  if (!parentRect || !gridLayout.value) return

  const mouseInGrid =
    mouseAt.x > parentRect.left &&
    mouseAt.x < parentRect.right &&
    mouseAt.y > parentRect.top &&
    mouseAt.y < parentRect.bottom

  if (mouseInGrid) {
    alert(
      `Dropped element props:\n${JSON.stringify(
        dragItem,
        ['x', 'y', 'w', 'h'],
        2,
      )}`,
    )
    gridLayout.value.dragEvent(
      'dragend',
      dropId,
      dragItem.x,
      dragItem.y,
      dragItem.h,
      dragItem.w,
    )
    layout.value = layout.value.filter((item) => item.i !== dropId)
  } else {
    return
  }

  layout.value.push({
    x: dragItem.x,
    y: dragItem.y,
    w: dragItem.w,
    h: dragItem.h,
    i: dragItem.i,
  })
  gridLayout.value.dragEvent(
    'dragend',
    dragItem.i,
    dragItem.x,
    dragItem.y,
    dragItem.h,
    dragItem.w,
  )

  const item = gridLayout.value.getItem(dropId)

  if (!item) return

  try {
    item.wrapper.style.display = ''
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped lang="scss">
.vgl-layout {
  background-color: #eee;
}
:deep(.vgl-item--placeholder) {
  background: rgb(255, 255, 255);
  opacity: 0.5;
}
:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 1px solid black;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: #cce;
}

.text {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: 24px;
  text-align: center;
}

.layout-json {
  padding: 10px;
  margin-top: 10px;
  background-color: #ddd;
  border: 1px solid black;
}

.columns {
  columns: 120px;
}

.droppable-element {
  width: 150px;
  padding: 10px;
  margin: 10px 0;
  text-align: center;
  background-color: #fdd;
  border: 1px solid black;
}
</style>
