<template>
  <div class="register bg-white">
    <van-nav-bar
      left-arrow
      title="修改密码"
      @click-left="$router.back(-1)"
      class="border-bottom"
    />

    <van-form
      ref="form"
      @submit="onSubmit"
      class="mt-4 pr-3 item-form"
    >
    <div class="box">
      <van-field
        v-model="password"
        placeholder="原密码"
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
      <span class="d-flex ml-3 pt-2 text-red err" :class="{'err-txt': !showPassErr}">{{ passErrText }}</span>
    </div>
    
    <div class="box">
      <van-field
        v-model="newPassword"
        placeholder="新密码"
        :show-error="false"
        class="mt-1"
        @focus="showPassTips1=true"
        @blur="showPassTips1=false"
        :rules="passRules1"
        :type="lookPwd1? 'text' : 'password'"
      />
      <span class="eyes-icon1" @click="handleChangePwd1">
        <span v-show="lookPwd1" class="iconfont icon-yanjing-zhengyan fs-xxl"></span>
        <span v-show="!lookPwd1" class="iconfont icon-biyan fs-xxl"></span>
      </span>
      
      <span class="d-flex ml-3 pt-2 text-red err" :class="{'err-txt1': !showPassErr1}">{{ passErrText1 }}</span>
    </div>

      

      <div class="mt-4 ml-3 pb-3">
        <van-button
          block
          native-type="submit"
          color="linear-gradient(to bottom right, #FFD611, #EAA61C)"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Toast } from 'vant'
export default {
  data() {
    return {
      type: 'login',
      message: '',
      password: '',
      newPassword: '',
      showPassTips: false,
      passErrText: '',
      lookPwd: false,
      showPassTips1: false,
      passErrText1: '',
      lookPwd1: false,
      passRules: [
        { validator: this.passValidator, message: ' ' }
      ],
      passRules1: [
        { validator: this.passValidator1, message: ' ' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      'userId': 'id'
    }),
    showPassErr: function() {
      return this.passErrText!==''
    },
    showPassErr1: function() {
      return this.passErrText!==''
    }
  },
  methods: {
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
    passValidator1(val){
      if (!val) {
        this.passErrText1 = '密码不能为空'
        return false
      }else if (/(^\s+)|(\s+$)|\s+/g.test(val)) {
        this.passErrText1 = '密码不允许有空格'
        return false
      } else if (/[\u4e00-\u9fa5]/.test(val)) {
        this.passErrText1 = '密码不允许有中文'
        return false
      } else if ( !/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/.test(val) ) {
        this.passErrText1 = '密码中字母/数字以及标点符号至少包含两种'
        return false
      }else if ( val.length<8 || val.length>14 ) {
        this.passErrText1 = '密码长度为8~14个字符'
        return false
      } else if(this.password === val) {
        this.passErrText1 = '原密码与新密码相同'
      }else {
        this.passErrText1 = ''
        return true
      }
    },
    async onSubmit() {
      await this.$http.put(`/rest/users/update/${this.userId}`, {oldPassword: this.password, password: this.newPassword})
      await this.$store.dispatch('user/logout')
      Toast.success('密码修改成功，请重新登录')
      this.$router.push({path: '/register', query: {url: '/my'}})
    },
    handleChangePwd() {
      this.lookPwd = !this.lookPwd
    },
    handleChangePwd1() {
      this.lookPwd1 = !this.lookPwd1
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  min-height: 100vh;
  ::v-deep {
    .van-nav-bar__title {
      font-weight: 550;
    }
    .van-icon-arrow-left,
    .van-nav-bar__text {
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
  .err-txt {
    visibility: hidden;
  }
  .err {
    min-width: 0.7692rem;
    min-height: 1.6692rem;
  }
  .eyes-icon {
    position:absolute;
    top: 0.6154rem;
    right: 1.5385rem;
  }
  .eyes-icon1 {
    position:absolute;
    top: 5.2308rem;
    right: 1.5385rem;
    z-index: 99;
  }
}
</style>