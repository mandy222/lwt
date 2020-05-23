<template>
  <div class="activity-detail">
    <van-nav-bar
      title="资讯"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="d-flex flex-wrap bg-white px-3">
      <h2 class="text-dark lh-bl mt-4 mb-0">
        {{ list.title }}
      </h2>
      <span class="text-grey-1 my-3 w-100 d-flex jc-between ai-center">
        <span>{{ `${list.publisher} ${handleTime(list.updatedAt, false, true)}` }} </span>
        <span class="d-flex ai-center">
            <van-icon
              v-show="likesIcon ==='star'"
              name="star"
              class="fs-xxl text-light"
              @click="handleLike"
            />
            <van-icon
              v-show="likesIcon==='star-o'"
              class="fs-xxl"
              name="star-o"
              @click="handleLike"
            />
          <span class="ml-1 mt-1 likes-text">{{ likesIcon==='star-o' ? '收藏' : '已收藏'}}</span>
        </span>
        
      </span>
      <div v-html="list.content" class="ql-editor detail"></div>
    </div>

    <!-- <div class="bg-white">
      <van-divider :style="{ color: '#333333', borderColor: '#EAA61C', padding: '0 16px' }">
        热门推荐
      </van-divider>
    </div> -->
  </div>
</template>

<script>
import { handleTime } from "../utils"
import { getToken } from '../utils/auth'
import { mapGetters } from 'vuex'
export default {
  props: {
    id: { required: true }
  },
  watch: {
    id: 'init'
  },
  computed: {
    ...mapGetters({
      'userId': 'id'
    })
  },
  created() {
    this.init()
    this.type = this.$route.query.type
    this.like = this.$route.query.like
    this.message = this.$route.query.message
  },
  data() {
    return {
      likesIcon: 'star-o',
      list: [],
      token: '',
      type: '',
      like: '',
      message: ''
    }
  },
  methods: {
    handleTime,
    async init() {
      this.token = getToken()
      const { data } = await this.$http.get(`/rest/news/list/${this.id}`)
      console.log('data', data)
      this.list = data

      if(this.token && this.list.collectedUsers.indexOf(this.userId) !== -1 ) {
        this.likesIcon = 'star'
      }
    },
    onClickLeft() {
      // this.$router.back(-1)
      console.log('this.type', this.type)
      if (this.like) {
        this.$router.push({ path: '/user/like', query: { like: this.like }})
      } else if(this.message) {
        this.$router.push({ path: '/search', query: { message: this.message }})
      } else if(this.type === undefined) {
        this.$router.back(-1)
      } else {
        this.$router.push({ path: '/news', query: { type: this.type }})
      }
      
    },
    async handleLike() {
      if (this.token) {
        if (this.likesIcon === 'star-o') {
          const collectedUsers = this.list.collectedUsers.concat([this.userId])
          await this.$http.put(`/rest/news/update/${this.id}`, {collectedUsers: collectedUsers})
          this.likesIcon = 'star'
        } else {
          const index = this.list.collectedUsers.indexOf(this.userId)
          let collectedUsers = this.list.collectedUsers
          collectedUsers.splice(index, 1)
          await this.$http.put(`/rest/news/update/${this.id}`, {collectedUsers: collectedUsers})
          this.likesIcon = 'star-o'
        }
      } else {
        this.$router.push('/register')
      }
    },
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
    .detail img {
      width: 100%;
    }
  }
  .likes-text {
    width: 4.0769rem;
  }
}
</style>