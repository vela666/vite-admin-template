<template>
  <div>
    <el-upload
      ref="upload"
      action="string"
      :show-file-list="false"
      :with-credentials="true"
      :http-request="uploadFiles"
      :auto-upload="true"
      :file-list="fileList">
      <el-button class="f-size-12">上传Excel</el-button>
    </el-upload>
    {{ $route.name }}
  </div>
</template>

<script setup>
import { onActivated, ref } from 'vue'
import ExcelJS from 'exceljs'

const fileList = ref([])

const uploadFiles = (params) => {
  const file = params.file // 相当于input里取得的files
  // const fileData = new FormData() // FormData 对象
  // fileData.append('file', fileObj) // 文件对象
  const reader = new FileReader()
  reader.onload = function (e) {
    const arrayBuffer = e.target.result

    // 使用exceljs解析Excel数据
    let workbook = new ExcelJS.Workbook()
    workbook.xlsx
      .load(arrayBuffer)
      .then(function () {
        const worksheet = workbook.getWorksheet(1) // 获取第一个工作表
        const jsonData = [] // 存储转换后的JSON数据

        const headerRow = worksheet.getRow(1)
        const columnNames = headerRow.values

        worksheet.eachRow(function (row, rowNumber) {
          if (rowNumber > 1) {
            // 跳过第一行的列头
            const rowData = {}

            row.eachCell(function (cell, colNumber) {
              let cellValue = cell.value
              const columnName = columnNames[colNumber]

              if (cell.type === ExcelJS.ValueType.Date) {
                cellValue = cellValue.toISOString().split('T')[0]
              }

              // 检查单元格值是否为空，如果为空，则将其设置为默认值
              if (!cellValue) {
                cellValue = '-'
              }

              rowData[columnName] = cellValue
            })

            jsonData.push(rowData)
          }
        })

        console.log(jsonData)
      })
      .catch(function (error) {
        console.log('读取Excel文件出错: ' + error)
      })
  }

  reader.readAsArrayBuffer(file)
}
defineOptions({
  name: 'ImportExcel1',
})

onActivated(() => {
  console.log('ImportExcel1')
})
</script>

<style scoped></style>
