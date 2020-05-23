<template>
  <div class="activity-detail">
    <van-nav-bar
      title="个人主页"
      left-arrow
      @click-left="onClickLeft"
      class="border-bottom"
    />
      <div class="d-flex  flex-wrap p-3 pb-2  bg-white">
        <div class="d-flex w-100 ai-center">
          <img
            class="avatar"
            v-if="info.avatar"
            :src="info.avatar"
            alt=""
          >
          <img
            class="avatar"
            v-if="!info.avatar"
            src="../assets/image/avatar-boy.jpg"
            alt=""
          >
          <span class="d-flex flex-1 pl-3 fs-xxl text-dark-1"><strong>{{ info.username }}</strong></span>
          <van-button
            round
            class="text-light my-2"
            size="small"
            @click="handleFocus"
            v-show="userId!==info._id"
          >{{ focus && token ? '取消关注' : '+ 关注'}}</van-button>
        </div>

        <ul class="d-flex ai-center my-4">
          <li class="d-flex flex-column mr-4 mb-0 pr-1 fs-lg text-dark">
            <span>{{ trendsList.length }}</span>
            <span class="mt-1">动态</span>
          </li>
          <li class="d-flex flex-column mr-4 mb-0 pr-1 fs-lg text-dark">
            <span>{{ info.follower && info.follower.length }}</span>
            <span class="mt-1">关注</span>
          </li>
          <li class="d-flex flex-column mr-4 mb-0 pr-1 fs-lg text-dark">
            <span>{{ info.fans && info.fans.length }}</span>
            <span class="mt-1">粉丝</span>
          </li>
        </ul>
    </div>

    <ul>
      <li
        v-for="(item, index) in trendsList"
        :key="index"
        class="bg-white my-3 p-3"
        :class="[index===0?'mt-0': 'mt-3']"
      >
        <div class="d-flex ai-center w-100 flex-wrap">
            <img
            class="avatar-s"
            v-if="item.user.avatar"
            :src="item.user.avatar"
            alt=""
          >
          <img
            class="avatar-s"
            v-if="!item.user.avatar"
            src="../assets/image/avatar-boy.jpg"
            alt=""
          >
          <span
            class="d-flex flex-1 pl-3 fs-lg text-dark-1"
          >{{ item.user.username }}</span>
        </div>
        <div class="d-flex flex-wrap ai-center">
          <div @click="handleComment(item._id)" class="w-100">
             <span class="d-flex w-100 text-dark-1 my-3 fs-lg">
              {{ item.content.text }}
            </span>

            <m-imgCard :img="item.content.images"></m-imgCard>
          </div>
         

          <div class="d-flex ai-center mt-3 fs-lg text-grey flex-1">
            <span
              class="d-flex ai-center"
              @click="handleComment(item._id)"
            >
              <van-icon
                name="chat-o"
                class="fs-xxl mr-1"
              />
              <span class="mt-2">{{ item.comments && item.comments.length || 0 }}</span>
            </span>
            <span class="d-flex ai-center ml-3 text-grey">
              <transition enter-active-class="animated jello">
                <van-icon
                  v-show="item.like"
                  name="good-job"
                  class="fs-xxl mr-1 text-light"
                  @click="handleLike(item.like, index)"
                />
              </transition>
              <transition enter-active-class="animated swing">
                <van-icon
                  v-show="!item.like"
                  class="fs-xxl mr-1 text-grey"
                  name="good-job-o"
                  @click="handleLike(item.like, index)"
                />
              </transition>
              <span class="mt-2">{{ item.likes && item.likes.length || 0 }}</span>
            </span>

          </div>
          <span
            v-if="token && userId === info._id" 
            class="d-flex fs-xxl text-grey mt-3"
          >
            <van-icon
              name="delete"
              @click="handleDelTrends(item._id, index)"
            />
          </span>
        </div>
      </li>
    </ul>

    <div class="gotop" v-show="showGoTop==true" @click="goTop">
      <van-icon name="arrow-up" class="bg-white text-grey-1 gotop-icon"/>
    </div>

    <div
      class="d-flex jc-center text-grey-1 fs-sm bg-white mb-4 py-2"
      v-if="trendsList.length>0"
      @click="handleLookMore"
    >
      {{ lookMore===true ? '点击查看更多' : '已经到底了~' }}
    </div>

    <van-empty class="bg-white" v-else description="暂无动态，赶快去分享你的动态吧~" />

  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { mapGetters } from 'vuex'
import { getToken } from '../utils/auth'
export default {
  props: {
    id: { required: true }
  },
  data() {
    return {
      token: '',
      focus: false,
      info: {},
      goodJobIcon: 'good-job-o',
      showGoTop:false,
      trendsList: [],
      lookMore: true,
      currentPage: 1,
      total: 0
    }
  },
  computed: {
    ...mapGetters({
      'userId': 'id',
      'follower': 'follower'
    })
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    this.init()
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    async init() {
      this.token = getToken()

      // 1、获取用户信息
      const info = await this.$http.get(`/rest/users/list/${this.id}`)
      this.info = info.data
      console.log('this.info', this.info)

      if (this.info.fans.indexOf(this.userId)!==-1) {
        this.focus = true
      } else {
        this.focus = false
      }

      // 获取列表
      const params = {
        pageSize: 10,
        currentPage: this.currentPage,
        user: this.info._id
      }
      const { data } = await this.$http.get(`/rest/trends/page/list`, {
        params: params
      })
      const { list, total } = data
      console.log('list', list)
      console.log('total', total)

      for (let i = 0; i < list.length; i++) {
        if (list[i].likes.indexOf(this.userId)!==-1) {
          list[i].like = true
        } else {
          list[i].like = false
        }
      }

      this.trendsList = this.trendsList.concat(list)
      this.total = total

      if (this.total <= (this.currentPage) * 10) {
        this.lookMore = false
      }

    },
    async handleLookMore() {
      this.currentPage++
      this.init()
    },
    handleScroll(){ 
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      // 控制回到顶部的显示和隐藏
      if(scrollTop > document.documentElement.clientWidth){
        this.showGoTop=true;
      }else{
        this.showGoTop=false;
      }
    },
    goTop(){
      document.documentElement.scrollTop=0
      document.body.scrollTop=0
    },
    async handleFocus() {
      if (this.token) {
        this.focus = !this.focus
        let fans = this.info.fans
        let follower = this.follower
        if (this.focus) { // 关注 自己 follower+1   用户 fans+1
          follower.push(this.info._id)
          fans.push(this.userId)
        } else {
          const i = follower.indexOf(this.info._id)
          const j = fans.indexOf(this.userId)
          follower.splice(i, 1)
          fans.splice(j, 1)
        }
        await this.$http.put(`/rest/users/update/${this.userId}`, { follower: follower, sender: this.userId, recipient: this.info._id })
        await this.$http.put(`/rest/users/update/${this.info._id}`, { fans: fans })
        Toast({
          message: this.focus ? '关注成功' : `已取消关注`,
          icon: 'passed'
        })

        // 更新个人信息
        await this.$store.dispatch('user/getInfo')
        const info = await this.$http.get(`/rest/users/list/${this.id}`)
        this.info = info.data
      } else {
        this.$router.push('/register')
      }
    },
    async handleLike(like = false, index) {
      if (this.token) {
        this.trendsList[index].like = !like
        let likeType = false
        if (!like) {
          likeType = true
          this.trendsList[index].likes.push(this.userId)
        } else {
          // 取消点赞
          const i = this.trendsList[index].likes.indexOf(this.userId)
          this.trendsList[index].likes.splice(i, 1)
        }
        let likes = Array.from(this.trendsList[index].likes)

        await this.$http.put(`/rest/trends/update/${this.trendsList[index]._id}`, 
          { likes: likes, likeType: likeType, sender: this.userId, recipient: this.trendsList[index].user._id })
      } else {
        this.$router.push('/register')
      }
    },
    handleComment(id) {
      this.$router.push(`/trends/${id}`)
    },
    async handleDelTrends(id, index) {
      Dialog.confirm({
        message: '确认删除该动态吗？',
      })
        .then(async () => {
          console.log('index', index)
          await this.$http.delete(`/rest/trends/delete/${id}`)
          this.trendsList.splice(index, 1)
          Toast.success('动态删除成功')
        })
        .catch(() => {
          // on cancel
        })
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
    .van-icon-arrow-left,
    .van-nav-bar__text {
      color: #eaa61c;
    }
  }
  .more-icon {
    position: absolute;
    right: 1rem;
  }
  .avatar {
    width: 4.9231rem;
    height: 4.9231rem;
    border-radius: 4.9231rem;
    border: 1px solid #d4d9de;
  }
  .avatar-s {
    width: 4rem;
    height: 4rem;
    border-radius: 4rem;
    border: 1px solid #d4d9de;
  }
}
</style>