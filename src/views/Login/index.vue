<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">

        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <!-- 支持栅格布局，一共是24列 -->
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
              <el-button
                @click="handleSendCode"
                :disabled="!!codeTimer || codeLoading"
              >
                {{ codeTimer ? `剩余${codeSecons}秒` : '获取验证码' }}
              </el-button>

            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree"></el-checkbox>
            <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加 class，会作用到它的根元素 -->
            <el-button
              class="btn-login"
              type="primary"
              @click="handleLogin"
              :loading="loginLoading"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import '@/vendor/gt.js'
const initCodeSeconds = 60

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '15133029565',
        code: '246810',
        agree: ''
      },
      loginLoading: false,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '长度是11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度是6个字符', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' } ]
      },
      captchaObj: null,
      codeSecons: initCodeSeconds,
      codeTimer: null,
      sendMobile: '',
      codeLoading: false
    }
  },
  methods: {
    handleLogin () {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }
        this.submitLogin()
      })
    },

    submitLogin () {
      this.loginLoading = true
      this.$http({
        method: 'POST',
        url: '/authorizations',
        data: this.form
      }).then(data => { // >= 200 && < 400 的状态码都会进入这里
        // Element 提供的 Message 消息提示组件，这也是组件调用的一种形式
        window.localStorage.setItem('user_info', JSON.stringify(data))
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.loginLoading = false
        // 建议路由跳转都使用 name 去跳转，路由传参非常方便
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        if (err.response.status === 400) {
          this.$message.error('登录失败，手机号或验证码错误')
        }
        this.loginLoading = false
      })
    },
    handleSendCode () {
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        // 有没有插件对象
        // 有通过
        if (this.captchaObj) {
          // return this.captchaObj.verify()
        // this.showGeetest()
        // 手机号码是否一致

          if (this.form.mobile !== this.sendMobile) {
            // 没有插件就初始化插件
            document.body.removeChild(document.querySelector('.geetest_panel'))
            this.showGeetest()
          } else {
            this.captchaObj.verify()
          }
        } else {
          this.showGeetest()
        }
      })
    },

    showGeetest () {
      this.codeLoading = true
      const { mobile } = this.form
      this.$http({
        method: 'GET',
        url: `/captchas/${this.form.mobile}`
      }).then(data => {
        // const data = res.data.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏按钮式
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(() => {
            // 只有 ready 了才能显示验证码
            this.sendMobile = this.form.mobile
            captchaObj.verify()
            this.codeLoading = false
          }).onSuccess(() => {
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
            captchaObj.getValidate()
            this.$http({
              method: 'GET',
              url: `/sms/codes/${mobile}`,
              params: {
                challenge,
                seccode,
                validate
              }
            }).then(data => {
              this.codeCountDown()
            })
          })
        })
      })
    },
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeSecons--
        if (this.codeSecons <= 0) {
          this.codeSecons = initCodeSeconds
          window.clearInterval(this.codeTimer)
          this.codeTimer = null
        }
      }, 1000)
    }
  }
}

</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  .login-head {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .login-form-wrap {
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
  .el-checkbox{
    margin-right: 10px
  }
}
</style>
