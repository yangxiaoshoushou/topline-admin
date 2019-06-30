<template>
  <el-row class="app-header">
    <el-col :span="14">江苏传智播客教育科技股份有限公司</el-col>
    <el-col :span="10">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img width="30" :src=" userInfo.photo ">
          {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>账户设置</el-dropdown-item>
          <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
  </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  },
  methods: {
    handleLogout () {
      this.$confirm('确定退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelbuttonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('user_info')
        this.$message({
          type: 'success',
          message: '退出成功！'
        })
        this.$router.push({
          name: 'login'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #409EFF;
  img {
    border-radius: 50%;
  }
}
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .app-header {
    padding-top: 10px;
  }
  .app-header {
  height: 60px;
  display: flex;
  align-items: center;
}

</style>
