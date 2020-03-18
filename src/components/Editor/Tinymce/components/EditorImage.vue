<template>
  <div class="upload-container">
    <a-upload
      name="file"
      :multiple="false"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      :headers="headers"
      :showUploadList="false"
      :disabled="loading"
      @change="handleChange"
    >
      <a-button type="primary" size="small"><a-icon :type="loading ? 'loading' : 'upload'" />上传</a-button>
    </a-upload>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data () {
    return {
      loading: false,
      fileList: []
    }
  },
  methods: {
    handleChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
        const url = info.file.response.url
        this.loading = false
        this.$emit('successCBK', url)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>
