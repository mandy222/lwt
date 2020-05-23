<template>
  <div class="trends">
    <van-sticky>
      <ul class="d-flex jc-around w-100 fs-lg text-grey-1  bg-white border-bottom ai-center">
        <li
          class="py-3"
          v-for="(item, index) in tabTitles"
          :key="index"
          @click="handleShowTab(index)"
        >
          <span
            class="tab-title pb-1"
            :class="{'tab-title-active': tabTitleIndex===index}"
          >
            {{ item }}
          </span>
        </li>
        <li
          class="border-left py-2"
          @click="$router.push('/trendsIssue')"
        >
          <van-icon
            name="edit"
            class="edit-icon fs-xxl text-light"
          />
        </li>
      </ul>
    </van-sticky>

    <ul
      v-show="index===tabTitleIndex"
      v-for="(item, index) in 2"
      :key="index"
    >
      <li
        v-for="(item, index) in trendsList"
        :key="index"
        class="bg-white my-3 p-3"
        :class="[index===0?'mt-0': 'mt-3']"
      >
        <div class="d-flex ai-center w-100 flex-wrap">
            <img
            class="avatar"
            v-if="item.user.avatar"
            :src="item.user.avatar"
            alt=""
            @click="$router.push(`/myTrends/${item.user._id}`)"
          >
          <img
            class="avatar"
            v-if="!item.user.avatar"
            src="../assets/image/avatar-boy.jpg"
            alt=""
            @click="$router.push(`/myTrends/${item.user._id}`)"
          >
          <span
            class="d-flex flex-1 pl-3 fs-lg text-dark-1"
            @click="$router.push(`/myTrends/${item.user._id}`)"
          >{{ item.user.username }}</span>
          
          <van-button
            round
            class="text-light my-2"
            size="small"
            @click="handleFocus(index)"
            v-if="!item.focus"
          >+ 关注</van-button>
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
            v-if="item.user._id===userId && token" 
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

    <div
      class="d-flex jc-center text-grey-1 fs-sm bg-white mb-4 py-2"
      v-if="trendsList.length>0"
      @click="handleLookMore"
    >
      {{ lookMore===true ? '点击查看更多' : '已经到底了~' }}
    </div>

    <van-empty class="bg-white" v-else description="暂无关注的童友" />

    <div
      class="gotop"
      v-show="showGoTop==true"
      @click="goTop"
    >
      <van-icon
        name="arrow-up"
        class="bg-white text-grey-1 gotop-icon"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Toast, Dialog } from 'vant'
import { getToken } from '../utils/auth'
export default {
  data() {
    return {
      showGoTop: false,
      tabTitleIndex: 0,
      tabTitles: ['推荐', '关注'],
      like: false,
      total: 0,
      trendsList: [],
      token: '',
      lookMore: true,
      currentPage: 1
    }
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
  computed: {
    ...mapGetters({
      'userId': 'id',
      'follower': 'follower',
      'name': 'name'
    })
  },
  methods: {
    async init(follower = [], lookMore = false, follow = false) {
      this.token = getToken()
      const params = {
        pageSize: 10,
        follower: follower,
        follow: follow,
        currentPage: this.currentPage
      }

      for (const key in params) {
        if (params[key] === []) {
          delete params[key]
        }
      }

      const { data } = await this.$http.get(`/rest/trends/page/list`, {
        params: params
      })
      const { list, total } = data
      console.log('list', list)
      for (let i = 0; i < list.length; i++) {
        if (list[i].likes.indexOf(this.userId)!==-1) {
          list[i].like = true
        } else {
          list[i].like = false
        }     

        if (list[i].user.fans.indexOf(this.userId) === -1 && list[i].user._id !== this.userId) {
          list[i].focus = false
        } else {
          list[i].focus = true
        }
      }
      if (lookMore) {
        this.trendsList = this.trendsList.concat(list)
      } else {
        this.trendsList = list
      }
      this.total = total

      if (this.total <= (this.currentPage) * 10) {
        this.lookMore = false
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
        console.log('likes', likes)

        await this.$http.put(`/rest/trends/update/${this.trendsList[index]._id}`, 
          { likes: likes, likeType: likeType, sender: this.userId, recipient: this.trendsList[index].user._id })
      } else {
        this.$router.push('/register')
      }
    },
    async handleFocus(index) {
      if (this.token) {
        console.log('trendsList[index]', this.trendsList[index])
        const fans = this.trendsList[index].user.fans.concat(this.userId)
        const follower = this.follower.concat(this.trendsList[index].user._id)
        await this.$http.put(`/rest/users/update/${this.userId}`, { follower: follower, sender: this.userId, recipient: this.trendsList[index].user._id })
        await this.$http.put(`/rest/users/update/${this.trendsList[index].user._id}`, { fans: fans })
        for (let i = 0; i < this.trendsList.length; i++) {
          if (this.trendsList[i].user._id === this.trendsList[index].user._id) {
            this.trendsList[i].focus = true
          }
        }
        Toast({
          message: '关注成功',
          icon: 'passed'
        })
        await this.$store.dispatch('user/getInfo')
      } else {
        this.$router.push('/register')
      }
    },
    handleComment(id) {
      this.$router.push(`/trends/${id}`)
    },
    handleShowTab(index) {
      console.log('index', index)
      this.tabTitleIndex = index
      if (index === 0) {
        this.init()
      } else {
        this.init(this.follower, false, true)
      }
    },
    handleScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      // 控制回到顶部的显示和隐藏
      if (scrollTop > document.documentElement.clientWidth) {
        this.showGoTop = true;
      } else {
        this.showGoTop = false;
      }
    },
    goTop() {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    },
    async handleLookMore() {
      this.currentPage++
      console.log('tabTitleIndex', this.tabTitleIndex)
      if (this.tabTitleIndex === 0) {
        this.init([], true, false)
      } else {
        this.init(this.follower, true, true)
      }
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

<style  lang="scss" scoped>
.trends {
  ::v-deep .van-button--default {
    border: 1px solid #eaa61c;
  }
  .tab-title {
    border-bottom: 3px solid white;
  }
  .tab-title-active {
    border-bottom: 3px solid #eaa61c;
    color: #eaa61c;
  }
  .edit-icon {
    position: relative;
    left: 1.6923rem;
  }
  .avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 4rem;
    border: 1px solid #d4d9de;
  }
}
</style>
