<template>
  <el-drawer
    v-model="visible"
    append-to-body
    destroy-on-close
    direction="rtl"
    class="n-drawer-tab"
    @close="$emit('close')"
    :title="title"
    :size="size">
    <template #header v-if="Object.keys($slots).includes('title')">
      <slot name="title"></slot>
    </template>
    <div class="drawer-t" v-show="tabs.length">
      <template v-for="item of tabs" :key="item.is">
        <el-button
          :class="{
            'drawer-btn-active': item.is.name === componentName,
          }"
          class="drawer-btn"
          text
          @click="tabsClick(item.is)">
          {{ item.label }}
        </el-button>
      </template>
    </div>
    <div class="n-drawer-tab-c" v-loading="loading">
      <div class="n-ab-test-detail-c-t">
        <slot></slot>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { shallowRef } from 'vue'
import { debounce } from 'lodash-es'
const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '900px',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  componentName: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['close', 'updTabs'])
const visible = shallowRef(false)

// 切换tab
const tabsClick = debounce((val) => {
  if (val.name === props.componentName) return
  emit('updTabs', val)
}, 300)

const open = () => {
  visible.value = true
}
defineExpose({
  open,
})

defineOptions({
  name: 'DrawerTab',
})
</script>

<style lang="scss">
.n-drawer-tab {
  .#{$customNameSpace}-drawer__header {
    margin-bottom: 0;
    align-items: center;
    justify-content: center;
    padding: 19px;
  }
  .#{$customNameSpace}-drawer__title {
    font-size: 14px;
    color: #1f1f1f;
    font-weight: 700;
  }
  .#{$customNameSpace}-drawer__body {
    display: flex;
    flex-direction: column;
    padding: 0;
    background: #f7f7f7;
  }
}
</style>
<style lang="scss" scoped>
.title {
  font-size: 14px;
  font-weight: bold;
  color: #1f1f1f;
}
.drawer-t {
  position: relative;
  border-top: 1px solid #dedede;
  background: #fff;
}
.n-drawer-tab-c {
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-top: 5px;
  flex: 1;
  overflow: hidden;
  .n-ab-test-detail-c-t {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
    overflow-y: overlay;
  }
}

.show-details {
  margin: 10px;
  overflow-y: auto;
  overflow-y: overlay;
}
.drawer-btn {
  width: 86px;
  height: 32px;
  border-radius: 0px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 0;
  transform: translateY(-1px);
  background-color: transparent !important;
  /* &:focus {
    color: var(--el-button-font-color, var(--el-text-color-regular));
    background: #fff;
  }*/

  &:hover {
    color: $color-primary;
    border-color: transparent;
  }
}

.drawer-btn-active {
  border: 1px solid $color-primary !important;
  color: $color-primary !important;
  background-color: #ecf6ff;
  border: 1px solid $color-primary;
}
</style>
