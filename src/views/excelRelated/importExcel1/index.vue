<template>
  <div>
    <el-upload
      ref="upload"
      accept=".xls,.xlsx"
      action="string"
      :show-file-list="false"
      :with-credentials="true"
      :http-request="uploadFiles"
      :auto-upload="true"
      :file-list="fileList">
      <el-button text class="f-size-12">上传Excel</el-button>
    </el-upload>
    {{ $route.name }}
  </div>
</template>

<script setup>
import { onActivated, ref } from 'vue'
const fileList = ref([])

const uploadFiles = (params) => {
  const fileObj = params.file // 相当于input里取得的files
  // const fileData = new FormData() // FormData 对象
  // fileData.append('file', fileObj) // 文件对象
}
defineOptions({
  name: 'ImportExcel1',
})

onActivated(() => {
  console.log('ImportExcel1')
})
</script>

<style scoped></style>
