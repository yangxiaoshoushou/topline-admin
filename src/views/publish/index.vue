<template>
<el-card class="publish-card">
  <div slot="header" class="header">
    <span>发布文章</span>
    <div>
      <el-button
        type="success"
        @click="handlePublish(false)"
        :loading="publishLoading"
        >{{ isEdit ? '更新' : '发布'}}</el-button>
      <el-button
        type="primary"
        @click="handlePublish(true)"
        :loading="publishLoading"
        >存入草稿</el-button>
    </div>

  </div>
  <el-form v-loading="isEdit && editLoading">
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
      editorOption: {},
      editLoading: false,
      publishLoading: false,
      formDirty: false
    }
  },
  watch: {
    $route (to, from) {
      //  如果是从更新页面来的
      if (from.name === 'publish-edit') {
        this.articleForm = {
          title: '',
          content: '',
          cover: {
            type: 0,
            inages: []
          },
          channel_id: ''
        }
      }
    }
  },
  // 监视器articleForm
  // 当数据改变时会被触发调用
  // 这里配置的监视器无法取消监视，会重复监视
  // watch: {
  //   articleForm: {
  //     handler () {
  //       console.log('123')
  //       this.formDirty = true
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    isEdit () {
      return this.$route.name === 'publish-edit'
    },
    articleId () {
      return this.$route.params.id
    }
  },
  created () {
    // if (this.$route.name === 'publish-edit') {
    //   this.loadArticle()
    // }
    this.isEdit && this.loadArticle()
    // 如果是发布页面直接发起监视
    if (this.$route.name === 'publish') {
      this.watchForm()
    }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  },
  methods: {
    loadArticle () {
      this.editLoading = true
      this.$http({
        method: 'GET',
        url: `/articles/${this.articleId}`
      }).then(data => {
        // 编辑页面的内容非用户修改的数据，所以不算是修改不需要立马监视
        this.articleForm = data
        this.editLoading = false
        // nextTick是延时调用
        this.$nextTick(() => {
          // 更新数据之后开启监视
          this.watchForm()
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('加载文章详情失败')
      })
    },
    handlePublish (draft = false) {
      this.publishLoading = true
      if (this.isEdit) {
        this.submitEdit(draft).then(() => {
          this.publishLoading = false
        })
      } else {
        this.submitAdd(draft).then(() => {
          this.publishLoading = false
        })
      }
    },
    submitEdit (draft) {
      return this.$http({
        method: 'PuT',
        url: `/articles/${this.articleId}`,
        data: this.articleForm,
        params: {
          draft
        }
      }).then(data => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('更新失败')
      })
    },
    submitAdd (draft) {
      return this.$http({
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
    },
    watchForm () {
      const unWatch = this.$watch('articleForm', function () {
        console.log('watchForm')
        this.formDirty = true
        // 关闭监视器
        unWatch()
      }, {
        deep: true
      })
    }
  },
  // 控制离开时是否有未保存的数据
  beforeRouteLeave (to, form, next) {
    if (!this.formDirty) {
      return next()
    }
    const answer = window.confirm('当前有未保存的数据，确定离开吗？')
    if (answer) {
      next()
    } else {
      next(false)
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
