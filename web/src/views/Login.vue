<template>
  <div class="login bg-white">
    <van-nav-bar
      left-arrow
      right-text="注册"
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
      @submit="onSubmit"
      class="mt-4 pr-3"
    >
      <van-field
        v-model="telephone"
        placeholder="账号"
        :rules="[{ required: true, message: '请输入账号' }]"
        :show-error="false"
      />
      <div
        class="code"
        v-if="loginType==='tel'"
      >
        <van-field
          v-model="passcode"
          placeholder="验证码"
          :rules="[{ required: true, message: '请填写验证码' }]"
          :show-error="false"
        />
        <span class="text-grey fs-lg code-text">获取验证码</span>
      </div>

      <van-field
        v-if="loginType==='account'"
        v-model="passcode"
        type="password"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
        :show-error="false"
      />

      <div class="mt-4 mx-3 pt-4 pb-3">
        <van-button
          block
          native-type="submit"
          color="linear-gradient(to bottom right, #FFD611, #EAA61C)"
        >
          登录
        </van-button>
      </div>
    </van-form>
    <!-- <span
      v-if="loginType==='tel'"
      class="ml-3 text-grey fs-md"
      @click="loginType='account'"
    >
      账号密码登录
    </span> -->
    <!-- <span
      v-if="loginType==='account'"
      class="ml-3 text-grey fs-md"
      @click="loginType='tel'"
    >
      短信验证登录
    </span> -->

  </div>
</template>

<script>

export default {
  data() {
    return {
      loginType: 'account',
      likesIcon: 'star-o',
      message: '',
      fileList: [],
      telephone: '',
      passcode: '',
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    onClickRight() {
      this.$router.push('/register')
    },
    onSubmit(values) {
      console.log('submit', values);
    },
  }
}
</script>

<style lang="scss" scoped>
.login {
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
}
</style>