<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="quill"
        :labelCol="{lg: {span: 3}, sm: {span: 3}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 21} }"
      >
        <!-- <a-textarea rows="4" placeholder="You are not alone."/> -->
        <quill-editor></quill-editor>
      </a-form-item>
      <a-form-item
        label="tinymce"
        :labelCol="{lg: {span: 3}, sm: {span: 3}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 21} }"
      >
        <!--
          给editor加key是因为给tinymce keep-alive以后组件切换时tinymce编辑器会显示异常，
          在activated钩子里改变key的值可以让编辑器重新创建
        -->
        <tinymce :key="tinymceFlag"></tinymce>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import QuillEditor from '@/components/Editor/QuillEditor.vue'
import Tinymce from '@/components/Editor/Tinymce'
export default {
  name: 'EditorForm',
  components: {
    QuillEditor,
    Tinymce
  },
  data () {
    return {
      description: '富文本编辑器演示，QuillEditor不能图片缩放，如果对图片没什么操作的用户，推荐使用,上传为公共API，比较慢',
      value: 1,
      tinymceFlag: 1
    }
  },
  activated () {
    this.tinymceFlag++
  }
}
</script>
