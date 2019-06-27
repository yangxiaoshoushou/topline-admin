<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
      </div>
      <el-form ref="form" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio
              v-for="(item,index) in statTypes"
              :key="item.label"
              :label="index + ''"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="filterParams.channel_id" placeholder="请选择活动区域">
            <el-option
              v-for="item in channels"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="begin_end_pubdate"
            @change="handleDateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="articleLoading"
            @click="onSubmit"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列表 -->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <!-- <span>共找到15条符合条件的内容</span> -->
        <span>共找到<strong>{{totalCount}}</strong>条符合条件的内容</span>
      </div>
      <el-table
        class="list-table"
        :data="articles"
        style="width: 100%"
        v-loading="articleLoading">
        <el-table-column
          prop="cover.images[0]"
          label="封面"
          width="60">
          <template slot-scope="scope">
            <img width="30" :src="scope.row.cover.images[0]">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布日期"
          width="180"
        ></el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
             <el-tag :type="statTypes[scope.row.status].type">{{statTypes[scope.row.status].label}} </el-tag>
          </template>
        ></el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="success" plain>修改</el-button>
            <el-button type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="articleLoading"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [],
      totalCount: 0,
      articleLoading: false,
      page: 1,
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      channels: [],
      filterParams: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      begin_end_pubdate: []
    }
  },
  created () {
    this.loadArticles()
    this.loadChannels()
  },
  methods: {
    loadArticles (page = 1) {
      this.articleLoading = true
      const filterData = {}
      for (let key in this.filterParams) {
        if (this.filterParams[key]) {
          filterData[key] = this.filterParams[key]
        }
      }
      console.log(filterData)
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page,
          per_page: 10,
          ...filterData
          // ...this.filterParams
        }
      }).then(data => {
        this.articles = data.results
        this.totalCount = data.total_count
        this.articleLoading = false
      })
    },
    loadChannels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        this.channels = data.channels
      })
    },
    onSubmit () {
      // this.page = 1
      this.loadArticles()
    },
    handleCurrentChange (page) {
      this.page = page
      this.loadArticles(page)
    },
    handleDelete (article) {
      this.$confirm('确定删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: `/articles/${article.id}`
        }).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDateChange (value) {
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 20px;
}
.list-table {
  margin-bottom: 30px;
}
</style>
