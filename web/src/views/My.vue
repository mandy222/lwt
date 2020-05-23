<template>
  <div class="my">
    <div class="nav-bg d-flex flex-wrap">
      <div class="w-100 top-box mx-3 bg-white d-flex flex-column">
        <img
          class="avatar"
          v-if="user.avatar"
          :src="user.avatar"
          alt=""
        >
        <img
          class="avatar"
          v-if="!user.avatar"
          src="../assets/image/avatar-boy.jpg"
          alt=""
        >
        <!-- <span class="name fs-xl w-100 ml-3" @click="handleLogin"><strong>登录/注册</strong></span> -->
        <span class="name fs-xl w-100 ml-3" @click="handleLogin"><strong>{{ login ? user.username : '登录/注册' }}</strong></span>

        <ul class="w-100 d-flex jc-around ai-center mt-3 text-grey-1">
          <li class="d-flex flex-column" @click="handleInfo">
            <van-icon
              class="fs-bl mb-1"
              name="comment-o"
              :badge="message"
            />
            <span>消息</span>
          </li>
          <li class="d-flex flex-column" @click="handleFollow">
            <van-icon
              class="fs-bl mb-1"
              name="like-o"
            />
            <span>关注</span>
          </li>
          <li class="d-flex flex-column" @click="handleFans">
            <van-icon
              class="fs-bl mb-1"
              name="friends-o"
            />
            <span>粉丝</span>
          </li>
          <li class="d-flex flex-column" @click="handleLike">
            <van-icon
              class="fs-bl mb-1"
              name="star-o"
            />
            <span>收藏</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="list list-top bg-white">
      <div class="van-hairline--top">
        <van-cell
          value=""
          icon="comment-circle-o"
          is-link
          class="-grey-1 fs-xl"
          @click="handleMyTrend"
        >
          <template #title>
            <span class="custom-title">我的动态</span>
          </template>
        </van-cell>
      </div>
      <van-cell
        value=""
        icon="bullhorn-o"
        is-link
        class="van-hairline--top text-grey-1 fs-xl"
        @click="handleMyActivity"
      >
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">我的活动</span>
        </template>
      </van-cell>
    </div>

    <div class="van-hairline--top list mt-3">
      <van-cell
        value=""
        icon="setting-o"
        is-link
        class="text-grey-1 fs-xl"
        @click="handleSetting"
      >
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">个人设置</span>
        </template>
      </van-cell>
    </div>

    <div class="van-hairline--top list mt-3">
      <van-cell
        value=""
        icon="info-o"
        is-link
        class="text-grey-1 fs-xl about-us"
      >
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">关于我们</span>
        </template>
      </van-cell>
      <van-cell
        value=""
        icon="envelop-o"
        is-link
        class="van-hairline--top text-grey-1 fs-xl"
      >
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">意见反馈</span>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>

import { getToken } from '../utils/auth'
export default {
  data() {
    return {
      login: false,
      user: {},
      message: ''
    }
  },
  created() {
    getToken()
    this.init()
  },
  methods: {
    async init() {
      const token = getToken()
      if (token) {
        this.login = true
        const data = await this.$store.dispatch('user/getInfo')
        this.user = data.list
        this.message = data.message===0 ? '' : data.message
      }
    },
    handleLogin() {
      if (!this.login) {
        this.$router.push('/register')
      }
    },
    handleInfo() {
      if (this.login) {
        this.$router.push('/user/information')
      } else {
        this.$router.push({path: '/register', query: {url: '/user/information'}})
      }
    },
    handleMyTrend() {
      if (this.login) {
        this.$router.push(`/myTrends/${this.user._id}`)
      } else {
        this.$router.push({path: '/register', query: {url: `/myTrends/${this.user._id}`}})
      }
    },
    handleMyActivity() {
      if (this.login) {
        this.$router.push(`/myActivity/${this.user._id}`)
      } else {
        this.$router.push({path: '/register', query: {url: `/myActivity/${this.user._id}`}})
      }
    },
    handleSetting() {
      if (this.login) {
        this.$router.push('/user/setting')
      } else {
        this.$router.push({path: '/register', query: {url: '/user/setting'}})
      }
    },
    handleFollow() {
      if (this.login) {
        this.$router.push('/user/follow')
      } else {
        this.$router.push({path: '/register', query: {url: '/user/follow'}})
      }
    },
    handleFans() {
      if (this.login) {
        this.$router.push('/user/fans')
      } else {
        this.$router.push({path: '/register', query: {url: '/user/fans'}})
      }
    },
    handleLike() {
      if (this.login) {
        this.$router.push('/user/like')
      } else {
        this.$router.push({path: '/register', query: {url: '/user/like'}})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.my {
  .nav-bg {
    height: 30vh;
    width: 100vw;
    background-image: url("../assets/image/myBg.png");
    background-repeat: repeat-x;
    background-position: top center;
    background-size: 375px 200px;
    position: relative;
    z-index: 3;
    .top-box {
      border-radius: 10px;
      box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
      height: 24vh;
      position: relative;
      top: 15vh;
      .avatar {
        position: relative;
        top: -5vh;
        left: 3vh;
        width: 5rem;
        height: 5rem;
        border-radius: 5rem;
        border: 1px solid #d4d9de;
      }
      .name {
        position: relative;
        top: -4vw;
        width: 5.5rem;
        text-align: center;
      }
    }
  }
  .list {
    &.list-top {
      padding-top: 11vh;
    }
    ::v-deep {
      .van-cell__left-icon {
        font-size: 1.5rem;
      }
      .van-cell:not(:last-child)::after {
        left: 0;
      }
      .van-cell {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>