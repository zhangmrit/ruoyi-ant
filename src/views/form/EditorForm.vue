<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="Bio"
        :labelCol="{lg: {span: 3}, sm: {span: 3}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 21} }"
      >
        <!-- <a-textarea rows="4" placeholder="You are not alone."/> -->
        <quill-editor></quill-editor>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import QuillEditor from '@/components/Editor/QuillEditor.vue'
export default {
  name: 'EditorForm',
  components: {
    QuillEditor
  },
  data () {
    return {
      description: '富文本编辑器演示，QuillEditor不能图片缩放，如果对图片没什么操作的用户，推荐使用',
      value: 1
    }
  }
}
</script>
