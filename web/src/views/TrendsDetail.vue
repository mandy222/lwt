<template>
  <div class="trends-detail">
    <van-nav-bar
      title=""
      left-arrow
      @click-left="$router.back(-1)"
    />

    <div class="p-3 bg-white">
      <div class="d-flex ai-center w-100 flex-wrap">
        <img
          class="avatar"
          v-if="list.user && list.user.avatar"
          :src="list.user && list.user.avatar"
          alt=""
          @click="$router.push(`/myTrends/${list.user._id}`)"
        >
        <img
          class="avatar"
          v-if="list.user && !list.user.avatar"
          src="../assets/image/avatar-boy.jpg"
          @click="$router.push(`/myTrends/${list.user._id}`)"
          alt=""
        >
        <span
          class="d-flex flex-1 pl-3 fs-lg text-dark-1"
          @click="$router.push(`/myTrends/${list.user._id}`)"
        >{{ list.user && list.user.username }}</span>
        <van-button
          round
          class="text-light my-2"
          size="small"
          @click="handleFocus"
          v-if="foucusShow"
        >+ 关注</van-button>
      </div>
      <div class="d-flex flex-wrap ai-center">
        <span class="w-100 text-dark-1 my-3 fs-lg">
          {{ list.content && list.content.text }}
        </span>

        <m-imgCard :img="list.content && list.content.images || []"></m-imgCard>

        <div class="d-flex ai-center mt-3 fs-lg text-grey flex-1">
          <span class="d-flex ai-center">
            <van-icon
              name="chat-o"
              class="fs-xxl mr-1"
            />
            <span class="mt-2">{{ list.comments && list.comments.length || 0 }}</span>
          </span>
          <span class="d-flex ai-center ml-3 text-grey">
            <transition enter-active-class="animated jello">
              <van-icon
                v-show="likeShow"
                name="good-job"
                class="fs-xxl mr-1 text-light"
                @click="handleLike(list.like)"
              />
            </transition>
            <transition enter-active-class="animated swing">
              <van-icon
                v-show="!likeShow"
                class="fs-xxl mr-1 text-grey"
                name="good-job-o"
                @click="handleLike(list.like)"
              />
            </transition>
            <span class="mt-2">{{ list.likes && list.likes.length || 0 }}</span>
          </span>

        </div>
        <span
          v-if="list.user && list.user._id===userId"
          class="d-flex fs-xxl text-grey mt-3"
        >
          <van-icon
            name="delete"
            @click="handleDelTrends"
          />
        </span>
      </div>
    </div>

    <div class="bg-white mt-3 p-3 pb-0">
      <p class="d-flex w-100 jc-between">
        <strong class="flex-1">评论区</strong>
        <span
          class="text-light d-flex ai-center"
          @click="handleComment"
        >写评论
          <van-icon name="edit" /></span>
      </p>
      <ul class="mt-3">
        <li
          class="d-flex ai-center w-100 flex-wrap"
          :class="{'border-top pt-3': index!==0}"
          v-for="(item, index) in comments"
          :key="index"
        >
          <img
            class="avatar-comment"
            v-if="item.avatar"
            :src="item.avatar"
            alt=""
          >
          <img
            class="avatar-comment"
            v-if="!item.avatar"
            src="../assets/image/avatar-boy.jpg"
            alt=""
          >
          <span class="d-flex flex-1 pl-3 fs-lg text-dark-1">{{ item.name }}</span>
          <p class="w-100 ml-4 pl-4 pb-0 mb-0">
            {{ item.content }}
          </p>
          <p class="d-flex fs-xl text-grey my-2 py-0 jc-between w-100">
            <span class="d-flex flex-1 ml-4 pl-4 fs-sm">
              {{ item.time }}
            </span>
            <van-icon
              name="delete"
              v-if="token && userId===item.id"
              @click="handleDelComment(index)"
            />
          </p>
        </li>
      </ul>
      <van-empty class="bg-white" v-if="comments.length===0" description="暂无评论，快来发表你的评论吧~" />
    </div>

  </div>
</template>

<script>
import { getToken } from '../utils/auth'
import { mapGetters } from 'vuex'
import { Toast, Dialog } from 'vant'
import { handleTime } from "../utils"
export default {
  props: {
    id: { required: true }
  },
  data() {
    return {
      token: '',
      likeShow: false,
      foucusShow: false,
      list: {},
      comments: []
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
      this.token = getToken()
      const { data } = await this.$http.get(`/rest/trends/list/${this.id}`)
      this.list = data
      if (this.list.user.fans.indexOf(this.userId) === -1 && this.list.user._id !== this.userId) {
        this.list.focus = false
        this.foucusShow = true
      } else {
        this.list.focus = true
      }

      if (this.list.likes && this.list.likes.indexOf(this.userId) !== -1) {
        this.likeShow = true
        this.list.like = true
      } else {
        this.like = false
      }

      if (this.list.comments) {
        for (let i = 0; i < this.list.comments.length; i++) {
          const comment = {
            content: this.list.comments[i].content,
            avatar: this.list.comments[i].user.avatar,
            name: this.list.comments[i].user.username,
            id: this.list.comments[i].user._id,
            time: handleTime(this.list.comments[i].commentsTime, false, true)
          }
          this.comments.push(comment)
        }
      }
    },
    async handleFocus() {
      if (this.token) {
        const fans = this.list.user.fans.concat(this.userId)
        const follower = this.follower.concat(this.list.user._id)
        await this.$http.put(`/rest/users/update/${this.userId}`, { follower: follower, sender: this.userId, recipient: this.list.user._id })
        await this.$http.put(`/rest/users/update/${this.list.user._id}`, { fans: fans })
        this.list.focus = true
        this.foucusShow = false
        Toast({
          message: '关注成功',
          icon: 'passed'
        })
        await this.$store.dispatch('user/getInfo')
      } else {
        this.$router.push('/register')
      }
    },
    async handleLike(like = false) {
      console.log('like', like)
      if (this.token) {
        this.list.like = !like
        this.likeShow = !like
        let likeType = false
        if (!like) {
          likeType = true
          this.list.likes.push(this.userId)
        } else {
          // 取消点赞
          const i = this.list.likes.indexOf(this.userId)
          this.list.likes.splice(i, 1)
        }
        let likes = Array.from(this.list.likes)

        await this.$http.put(`/rest/trends/update/${this.id}`,
          { likes: likes, likeType: likeType, sender: this.userId, recipient: this.list.user._id })
      } else {
        this.$router.push('/register')
      }
    },
    async handleDelTrends() {
      if (this.token) {
        Dialog.confirm({
          message: '确认删除该动态吗？',
        })
          .then(async () => {
            // console.log('index', index)
            await this.$http.delete(`/rest/trends/delete/${this.id}`)
            Toast.success('动态删除成功')
            this.$router.back(-1)
          })
          .catch(() => {
            // on cancel
          })
      } else {
        this.$router.push('/register')
      }
    },
    async handleDelComment(index) {
      Dialog.confirm({
        message: '确认删除该评论吗？',
      })
        .then(async () => {
          this.list.comments.splice(index, 1)
          for (let i = 0; i < this.list.comments.length; i++) {
            this.list.comments[i].user = this.list.comments[i].user._id
          }
          await this.$http.put(`/rest/trends/update/${this.list._id}`,
            { comments: this.list.comments, commentsDel: true, sender: this.userId, recipient: this.list.user._id })
          Toast.success('评论删除成功')
          this.comments.splice(index, 1)
        })
        .catch(() => {
          // on cancel
        })

    },
    handleComment() {
      if (this.token) {
        this.$router.push({
          path: `/trends/comment/${this.id}`,
          query: {
            comments: this.list.comments,
            recipient: this.list.user._id,
          }
        })
      } else {
        this.$router.push('/register')
      }
    }
  }
}
</script>

<style  lang="scss" scoped>
.trends-detail {
  ::v-deep {
    .van-icon-arrow-left {
      color: #eaa61c;
    }
  }
  .avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 4rem;
    border: 1px solid #d4d9de;
  }
  .avatar-comment {
    width: 3rem;
    height: 3rem;
    border-radius: 3rem;
    border: 1px solid #d4d9de;
  }
}
</style>
