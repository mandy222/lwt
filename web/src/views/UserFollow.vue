<template>
  <div class="info">
    <van-nav-bar
      title="我的关注"
      left-arrow
      @click-left="$router.back(-1)"
      class="border-bottom"
    />
    
    <ul class="bg-white">
      <li class="d-flex jc-between px-3 mx-1 py-3 ai-center fs-lg text-grey-1 border" v-for="(item, index) in list" :key="index">
        <img
          class="avatar"
          v-if="item.avatar"
          :src="item.avatar"
          alt=""
          @click="$router.push(`/myTrends/${item._id}`)"
        >
        <img
          class="avatar"
          v-else
          src="../assets/image/avatar-boy.jpg"
          alt=""
          @click="$router.push(`/myTrends/${item._id}`)"
        >
        <span class="d-flex flex-1 jc-star ml-3" @click="$router.push(`/myTrends/${item._id}`)">{{ item.username }}</span>
        <van-button
          round
          class="text-light my-2"
          size="small"
          @click="handleFocus(item, index)"
        >取消关注</van-button>
      </li>
    </ul>

    <van-empty class="bg-white" v-if="list.length===0" description="你还没有关注任何人，快去关注吧~" />

  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      focus: false,
      list: []
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters({
      'userId': 'id',
      'follower': 'follower'
    })
  },
  methods: {
    async init() {
      let follower = this.follower.length == 0 ? 'null' : this.follower
      const { data } = await this.$http.get(`/rest/users/list`, 
      {
        params: { follower: follower}
      }
      )
      this.list = data
    },
    async handleFocus(item, index) {
        let fans = item.fans
        let follower = this.follower
        const i = follower.indexOf(item._id)
        const j = fans.indexOf(this.userId)
        follower.splice(i, 1)
        fans.splice(j, 1)
        await this.$http.put(`/rest/users/update/${this.userId}`, { follower: follower, sender: this.userId, recipient: item._id })
        await this.$http.put(`/rest/users/update/${item._id}`, { fans: fans })
        Toast({
          message: `已取消对“${item.username}”的关注`,
          icon: 'passed'
        })
        this.list.splice(index, 1)

        // 更新个人信息
        await this.$store.dispatch('user/getInfo')
    }
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
    bottom: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 4rem;
    border: 1px solid #d4d9de;
  }
}
</style>