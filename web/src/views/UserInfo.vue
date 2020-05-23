<template>
  <div class="info">
    <van-nav-bar
      title="我的消息"
      left-arrow
      @click-left="$router.back(-1)"
      class="border-bottom"
    />
    
    <ul class="bg-white">
      <li class="d-flex jc-between px-3 mx-1 py-3 ai-center fs-lg text-grey-1" @click="$router.push(`/info/follower/${userId}`)">
        <van-icon class="fs-xxl" name="like-o" :badge="dots[0]===0 ? '' : dots[0]" />
        <span class="d-flex flex-1 ml-2">关注</span>
        <van-icon name="arrow" />
      </li>
      <li class="d-flex jc-between px-3 mx-1 py-3 ai-center fs-lg text-grey-1 border" @click="$router.push(`/info/comments/${userId}`)">
        <van-icon class="fs-xxl" name="chat-o" :badge="dots[1]===0 ? '' : dots[1]" />
        <span class="d-flex flex-1 ml-2">评论</span>
        <van-icon name="arrow" />
      </li>
      <li class="d-flex jc-between px-3 mx-1 py-3 ai-center fs-lg text-grey-1 border" @click="$router.push(`/info/likes/${userId}`)">
        <van-icon class="fs-xxl" name="good-job-o" :badge="dots[2]===0 ? '' : dots[2]" />
        <span class="d-flex flex-1 ml-2">点赞</span>
        <van-icon name="arrow" />
      </li>
    </ul>
  </div>
</template>

<script>

// import { getToken } from '../utils/auth'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dots: ['', '', '']
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters({
      'userId': 'id'
    })
  },
  methods: {
    async init() {
      const { data } = await this.$http.get(`/info/category/count/${this.userId}`)
      this.dots = data
      console.log('data', data)
    },
  }
}
</script>

<style lang="scss" scoped>
.info {
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
    .van-nav-bar__title {
      font-weight: 550;
    }
    .van-icon-arrow-left,
    .van-nav-bar__text {
      color: #eaa61c;
    }
  }
  .border {
    position: relative;
  }
  .border::before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
</style>