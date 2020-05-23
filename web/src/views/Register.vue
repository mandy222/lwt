<template>
  <div class="register bg-white">
    <van-nav-bar
      left-arrow
      :right-text="type==='login' ? '注册' : '登录'"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="d-flex bg-white flex-column flex-wrap ai-center">
      <div class="d-flex w-100 jc-center my-3 ai-center">
        <img
          src="../assets/image/logo.png"
          class="logo"
          alt=""
        >
      </div>
      <span class="text-grey-1">让老人老有所乐</span>
    </div>

    <van-form
      ref="form"
      @submit="onSubmit"
      class="mt-4 pr-3 item-form"
    >
      <van-field
        v-model.trim="userInfo.username"
        placeholder="用户名"
        :rules="usernameRules"
        :show-error="false"
        :show-error-message="false"
        @focus="showAccoutTips=true"
        @blur="showAccoutTips=false"
      />
      <div class="tips" v-show="showAccoutTips">
        中英文均可，最长14个英文或7个汉字
      </div>
      <span class="d-flex ml-3 pt-2 text-red err" :class="{'err-txt': !showAccoutErr}">{{ usernameErrText }}</span>
      <van-field
        v-model="userInfo.password"
        placeholder="密码"
        :show-error="false"
        class="mt-1"
        @focus="showPassTips=true"
        @blur="showPassTips=false"
        :rules="passRules"
        :type="lookPwd? 'text' : 'password'"
      />
      <span class="eyes-icon" @click="handleChangePwd">
        <span v-show="lookPwd" class="iconfont icon-yanjing-zhengyan fs-xxl"></span>
        <span v-show="!lookPwd" class="iconfont icon-biyan fs-xxl"></span>
      </span>
      
      <div class="tips tips2" v-show="showPassTips">
        <ul>
          <li>长度为8~14个字符</li>
          <li>字母/数字以及标点符号至少包含两种</li>
          <li>不允许有空格、中文</li>
        </ul>
      </div>
      <span class="d-flex ml-3 pt-2 text-red err" :class="{'err-txt': !showPassErr}">{{ passErrText }}</span>

      <div class="mt-4 ml-3 pb-3">
        <van-button
          block
          native-type="submit"
          color="linear-gradient(to bottom right, #FFD611, #EAA61C)"
        >
          {{ type==='login' ? '登录' : '注册' }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      type: 'login',
      message: '',
      fileList: [],
      userInfo: {
        username: '',
        password: ''
      },
      showAccoutTips: false,
      showPassTips: false,
      usernameErrText: '',
      passErrText: '',
      lookPwd: false,
      usernameRules: [
        { validator: this.usernameValidator, message: ' ' }
      ],
      passRules: [
        { validator: this.passValidator, message: ' ' }
      ],
      link: ''
    }
  },
  computed: {
    showAccoutErr: function() {
      return this.usernameErrText!==''
    },
    showPassErr: function() {
      return this.passErrText!==''
    }
  },
  created() {
    this.link = this.$route.query.type
    this.url = this.$route.query.url
  },
  methods: {
    usernameValidator(val){
      const len = val.replace(/[\u4e00-\u9fa5]/ig, '__').length
      if (!val) {
        this.usernameErrText = '用户名不能为空'
        return false
      }else if (/[^\u4E00-\u9FA5\w]/.test(val)) {
        this.usernameErrText = '用户名不能包含非法字符'
        return false
      } else if (!/\D/.test(val)) {
        this.usernameErrText = '用户名不能是纯数字'
        return false
      } else if ( len>14 ) {
        this.usernameErrText = '用户名不能超过14个英文或7个汉字'
        return false
      } else {
        this.usernameErrText = ''
        return true
      }
    },
    passValidator(val){
      if (!val) {
        this.passErrText = '密码不能为空'
        return false
      }else if (/(^\s+)|(\s+$)|\s+/g.test(val)) {
        this.passErrText = '密码不允许有空格'
        return false
      } else if (/[\u4e00-\u9fa5]/.test(val)) {
        this.passErrText = '密码不允许有中文'
        return false
      } else if ( !/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/.test(val) ) {
        this.passErrText = '密码中字母/数字以及标点符号至少包含两种'
        return false
      }else if ( val.length<8 || val.length>14 ) {
        this.passErrText = '密码长度为8~14个字符'
        return false
      } else {
        this.passErrText = ''
        return true
      }
    },
    onClickLeft() {
      this.$router.back(-1)
    },
    onClickRight() {
      this.$refs['form'].resetValidation()
      this.userInfo = {
        username: '',
        password: ''
      }
      this.usernameErrText = ''
      this.passErrText = ''
      this.type==='login' ? this.type='register' : this.type='login'
    },
    async onSubmit() {
      console.log('this.type', this.type)
      if (this.type!=='login') {
        await this.$store.dispatch('user/register', this.userInfo)
      } else {
        await this.$store.dispatch('user/login', this.userInfo)
      }
      await this.$store.dispatch('user/getInfo')
      if (this.url) {
        this.$router.push(this.url)
      } else {
        this.$router.back(-1)
      }
    },
    handleChangePwd() {
      this.lookPwd = !this.lookPwd
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  min-height: 100vh;
  ::v-deep {
    .van-icon-arrow-left {
      color: #eaa61c;
    }
    .van-cell:not(:last-child)::after {
      border-bottom: 1px solid #d4d9de;
    }
    .van-nav-bar__text {
      color: #333333;
    }
    .van-nav-bar__text {
      font-size: 1.1538rem;
    }
  }
  .logo {
    width: 48vw;
    height: 14.4vw;
  }
  .code {
    position: relative;
    .code-text {
      position: absolute;
      top: 15px;
      right: 10px;
    }
  }
  .item-form {
    position: relative;
  }
  .tips {
    position: absolute;
    bottom: 15.3rem;
    left: 1rem;
    z-index: 99;
    color: white;
    background-color: #333333;
    padding: 0.7692rem;
    border-radius: 4px;
  }
  .tips::after {
    content: '';
    display: block;
    height: 0;
    bottom: -0.4615rem;
    position: absolute;
    border-width: .5rem .4rem 0;
    border-style: solid;
    border-color: #333333 transparent transparent;
  }
  .tips2 {
    bottom: 142px;
    left: 130px;
  }
  .err-txt {
    visibility: hidden;
  }
  .err {
    min-width: 10px;
    min-height: 21.7px;
  }
  .eyes-icon {
    position:absolute;
    top: 73px;
    right: 20px;
  }
}
</style>