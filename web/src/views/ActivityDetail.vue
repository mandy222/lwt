<template>
  <div class="activity-detail">
    <van-nav-bar
      title="活动"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="d-flex flex-wrap bg-white px-3">
      <img
        :src="list.cover"
        alt=""
        class="w-100 first-img"
      >
      <h2 class="text-dark lh-bl my-4">
          {{ list.name }} 
      </h2>
      <p class="d-flex w-100 ai-center fs-lg my-1">
        <van-icon name="clock-o" class="fs-xl mr-1" />
        <span>
          <strong>{{ handleTime(list.time, true, true) }}</strong>
        </span>
      </p>
      <p class="d-flex w-100 ai-center fs-lg mt-1">
        <van-icon name="location-o" class="fs-xl mr-1" />
        <span>
          <strong>{{ list.address }}</strong>
        </span>
      </p>
    </div>

    <m-panel
      icon="shu"
      title="活动详情"
    >
      <div class="pb-2 mb-6 detail ql-editor" v-html="list.content"></div>
    </m-panel>

    <ul class="d-flex jc-between ai-center bg-white py-2 px-3 w-100 bottom-nav">
      <li>
        <div class="d-flex flex-column text-grey-1 likes ai-center">
          <transition
            enter-active-class="animated heartBeat"
          >
            <van-icon
              v-show="likesIcon ==='star'"
              name="star"
              class="fs-bl text-light"
              @click="handleLike"
            />
          </transition>
          <transition
            enter-active-class="animated heartBeat"
          >
            <van-icon
              v-show="likesIcon==='star-o'"
              class="fs-bl"
              name="star-o"
              @click="handleLike"
            />
          </transition>
          <span v-show="likesIcon==='star-o'" class="fs-sm">收藏</span>
          <span v-show="likesIcon!=='star-o'" class="fs-sm">已收藏</span>
        </div>
      </li>
      <li><van-button color="#EAA61C" round size="normal" :disabled="!status" @click="handleApply">{{ applyText }}</van-button></li>
    </ul>
  </div>
</template>

<script>
import { handleTime } from "../utils"
import { getToken } from '../utils/auth'
import { Toast } from 'vant'
import { mapGetters } from 'vuex'
export default {
  props: {
    id: { required: true }
  },
  data() {
    return {
      likesIcon: 'star-o',
      list: {},
      type: '',
      token: '',
      applyText: '立即报名',
      status: true,
      message: ''
    }
  },
  watch: {
    id: 'init',
  },
  computed: {
    ...mapGetters({
      'userId': 'id'
    })
  },
  created() {
    this.init()
    this.type = this.$route.query.type
    this.message = this.$route.query.message
  },
  methods: {
    handleTime,
    async init() {
      this.token = getToken()
      const { data } = await this.$http.get(`/rest/activities/list/${this.id}`)
      console.log('data', data)
      this.list = data

      if (!this.list.status) {
        this.status = false
        this.applyText = '活动已结束'
      }
      if(this.token && this.list.collectedUsers.indexOf(this.userId) !== -1 ) {
        this.likesIcon = 'star'
      }
      if(this.token && this.list.participants.indexOf(this.userId) !== -1 ) {
        this.applyText = '取消报名'
      }
    },
    onClickLeft() {
      if (this.type === 'home' || this.type === 'my') {
        this.$router.back(-1)
      } else if(this.message) {
        this.$router.push({ path: '/search', query: { message: this.message }})
      }else {
        this.$router.push({ path: '/activity', query: { type: this.type }})
      }
    },
    async handleLike() {
      if (this.token) {
        if (this.likesIcon === 'star-o') {
          const collectedUsers = this.list.collectedUsers.concat([this.userId])
          await this.$http.put(`/rest/activities/update/${this.id}`, {collectedUsers: collectedUsers})
          this.likesIcon = 'star'
        } else {
          const index = this.list.collectedUsers.indexOf(this.userId)
          let collectedUsers = this.list.collectedUsers
          collectedUsers.splice(index, 1)
          await this.$http.put(`/rest/activities/update/${this.id}`, {collectedUsers: collectedUsers})
          this.likesIcon = 'star-o'
        }
      } else {
        this.$router.push('/register')
      }
    },
    async handleApply() {
      if (this.token) {
        if (this.applyText === '立即报名') {
          const participants = this.list.participants.concat([this.userId])
          await this.$http.put(`/rest/activities/update/${this.id}`, {participants: participants})
          Toast.success('报名成功')
          this.applyText = '取消报名'
        } else {
          const index = this.list.participants.indexOf(this.userId)
          let participants = this.list.participants
          participants.splice(index, 1)
          await this.$http.put(`/rest/activities/update/${this.id}`, {participants: participants})
          Toast.success('取消报名成功')
          this.applyText = '立即报名'
        }
      } else {
        this.$router.push('/register')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-detail {
  ::v-deep {
    .van-nav-bar__title {
      font-weight: 550;
    }
    .van-icon-arrow-left {
      color: #eaa61c;
    }
    .van-button {
      height: 2.9231rem;
      line-height: 2.9231rem;
    }
    .van-button--normal {
      padding: 0 6.1538rem;
    }
    .detail img {
      width: 100%;
    }
  }
  .first-img {
    border-radius: .5rem;
  }
  .bottom-nav {
    position: fixed;
    bottom: 0;
    -webkit-box-shadow: -1px 0px 6px 2px rgba(176,170,176,0.37);
    -moz-box-shadow: -1px 0px 6px 2px rgba(176,170,176,0.37);
    box-shadow: -1px 0px 6px 2px rgba(176,170,176,0.37);
  }
  .likes {
    position: absolute;
    top: .4rem
  }
}
</style>