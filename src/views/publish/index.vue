<template>
<el-card class="publish-card">
  <div slot="header" class="header">
    <span>发布文章</span>
    <div>
      <el-button type="success" @click="handlePublish(false)">发布</el-button>
      <el-button type="primary" @click="handlePublish(true)">存入草稿</el-button>
    </div>

  </div>
  <el-form>
    <el-form-item>
      <el-input type="text" v-model="articleForm.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item>
      <quill-editor v-model="articleForm.content"
        ref="myQuillEditor"
        :options="editorOption">
      </quill-editor>
    </el-form-item>
    <el-form-item label="封面">
    </el-form-item>
    <el-form-item label="频道">
      <article-channel
        v-model="articleForm.channel_id"
      ></article-channel>
    </el-form-item>
  </el-form>
</el-card>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'AppPublish',
  components: {
    ArticleChannel,
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: 3
      },
      editorOption: {}
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  },
  methods: {
    handlePublish (draft = false) {
      this.$http({
        method: 'POST',
        url: '/articles',
        data: this.articleForm,
        params: {
          draft
        }
      }).then(data => {
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('发布失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.publish-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
