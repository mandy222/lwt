<template>
  <div class="activity">
    <van-nav-bar
      title="我的收藏"
      left-arrow
      @click-left="$router.push('/my')"
      class="border-bottom"
    />

    <van-tabs
      v-if="showTab"
      color="#EAA61C"
      sticky
      line-width="2.3077rem"
      @click="handleShow"
      v-model="activeName"
    >
      <van-tab
        v-for="(item, index) in ['活动', '资讯']"
        :key="index"
        :title="item"
        :name="item"
        class="mt-0 bg-white"
      />
    </van-tabs>

    <div v-if="activeName === '活动' && showTab">
      <div class="bg-white">
        <div
          v-for="(activitis, i) in list"
          :key="i"
          class="activity-item px-3"
          :class="{'item-box': i!==list.length}"
          @click="$router.push({ path: `/activities/${activitis._id}`, query: { type: 'home' }})"
        >
          <div
            class="d-flex w-100 jc-between pb-2 border-bottom"
            :class="{'mt-3 pt-2': i!==0, 'pt-3': i===0}"
          >
            <img
              class="mr-3"
              :src="activitis.cover"
              alt=""
            >
            <div class="flex-1 overflow-hidden lh-xxl pr-2 ai-stretch d-flex flex-column">
              <span class="w-100 fs-xl text-dark-1 ellipsis-2 pr-1 mb-1">
                {{ activitis.name }}
              </span>
              <div class="flex-1 w-100"></div>
              <span class="fs-sm pr-2 text-grey-1">{{ activitis.leader }}</span>
              <span class="fs-sm pr-2 text-grey-1">{{ handleTime(activitis.time, false, false) }}</span>
            </div>
          </div>
          <div class="d-flex w-100 jc-between ai-center">
            <span class="text-light my-2">
              <span
                class="mr-2"
                v-for="(keyWord, j) in activitis.keyWords"
                :key="j"
              >{{ `#${keyWord}` }}</span>
            </span>
            <van-button
              round
              class="btn text-light my-2"
              size="small"
            >{{ activitis.status===true ? (activitis.participants.indexOf(userId)!==-1 ? '取消报名': '立即报名') : `活动已结束`}}</van-button>
          </div>
        </div>
      </div>
      <div
        v-if="list.length>0"
        class="w-100 py-2 mb-4 mt-2 d-flex jc-center text-grey-1 fs-sm bg-white"
        @click="handleLookMore"
      >
        {{ lookMore===true ? '点击查看更多' : '已经到底了~' }}
      </div>
      <van-empty class="bg-white" v-else description="暂无活动收藏，快去收藏活动吧~" />

    </div>

    <div v-if="activeName === '资讯' && showTab">
      <ul class="bg-white">
        <li
          v-for="(item, index) in list"
          :key="index"
          @click="$router.push({ path: `/news/${item._id}`, query: { like: '资讯' }})"
        >
          <div
            class="news-item px-3"
            v-if="item.cover.length===1"
          >
            <div class="d-flex w-100 jc-between border-bottom py-3">
              <img
                class="mr-3"
                :src="item.cover[0]"
                alt=""
              >
              <div class="flex-1 overflow-hidden lh-xxl pr-2 ai-stretch d-flex flex-column">
                <span class="w-100 fs-xl text-dark-1 ellipsis-2 pr-1 mb-1">
                  {{ item.title }}
                </span>
                <div class="flex-1 w-100"></div>
                <span class="fs-sm pr-2 text-grey-1">{{ item.publisher}}</span>
                <span class="fs-sm pr-2 text-grey-1">{{ handleTime(item.updatedAt, false, false)}}</span>
              </div>
            </div>
          </div>

          <div
            class="news-item px-3"
            v-if="item.cover.length===0"
          >
            <div class="border-bottom py-3 lh-xxl pr-2 ai-stretch d-flex flex-column">
              <span class="w-100 fs-xl text-dark-1 ellipsis-2 pr-1 mb-3">
                {{ item.title }}
              </span>
              <span class="fs-sm pr-2 text-grey-1">{{ `${item.publisher} ${handleTime(item.updatedAt, false, false)}` }}</span>
            </div>
          </div>

          <div
            class="news-item px-3"
            v-if="item.cover.length===3"
          >
            <div class="border-bottom py-3">
              <span class="w-100 fs-xl text-dark-1 ellipsis-2 pr-1 mb-1 lh-xxl">
                {{ item.title }}
              </span>
              <div class="d-flex jc-between three-layout">
                <img
                  :src="item.cover[0]"
                  alt=""
                >
                <img
                  :src="item.cover[1]"
                  alt=""
                >
                <img
                  :src="item.cover[2]"
                  alt=""
                >
              </div>
              <span class="fs-sm text-grey-1 d-flex mt-2">{{ `${item.publisher} ${handleTime(item.updatedAt, false, false)}` }}</span>
            </div>
          </div>
        </li>
      </ul>
      <div
        v-if="list.length>0"
        class="w-100 py-2 mb-4 mt-2 d-flex jc-center text-grey-1 fs-sm bg-white"
        @click="handleLookMore"
      >
        {{ lookMore===true ? '点击查看更多' : '已经到底了~' }}
      </div>
      <van-empty class="bg-white" v-else description="暂无资讯收藏，快去收藏资讯吧~" />
    </div>

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
import { handleTime } from '../utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      lookMore: true,
      total: 0,
      showGoTop: false,
      activityText: '立即报名',
      activeName: '活动',
      showTab: false,
    }
  },
  computed: {
    ...mapGetters({
      'userId': 'id'
    })
  },
  created() {
    this.activeName = this.$route.query.like || '活动'
    setTimeout(() => {
      this.showTab = true
    }, 50)
    this.init()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleTime,
    async init(lookMore = false) {
      if (this.activeName === '活动') {
        const { data } = await this.$http.get(`/rest/activities/page/list`, {
          params: {
            collectedUsers: this.userId,
            pageSize: 10,
            currentPage: this.currentPage
          }
        })
        if (lookMore) {
          this.list = this.list.concat(data.list)
        } else {
          this.list = data.list
        }
        this.total = data.total
      } else {
        const { data } = await this.$http.get(`/rest/news/page/list`, {
          params: {
            collectedUsers: this.userId,
            pageSize: 10,
            currentPage: this.currentPage
          }
        })
        if (lookMore) {
          this.list = this.list.concat(data.list)
        } else {
          this.list = data.list
        }
        this.total = data.total
      }
      if (this.total <= (this.currentPage) * 10) {
        this.lookMore = false
      }
    },
    async handleLookMore() {
      this.currentPage++
      this.init(true)
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
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },
    handleShow(name) {
      console.log('name', name)
      this.activeName = name
      this.init(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.activity {
  ::v-deep {
    .van-tab--active {
      color: #eaa61c;
    }
    .van-tabs__wrap--scrollable {
      padding-bottom: 0.7rem;
    }
    .van-button--default {
      border: 1px solid #eaa61c;
    }
    .van-sticky {
      border-bottom: 1px solid #d4d9de;
    }
    .van-nav-bar__title {
      font-weight: 550;
    }
    .van-icon-arrow-left,
    .van-nav-bar__text {
      color: #eaa61c;
    }
    .van-tabs__line {
      bottom: 23px;
    }
  }
  .activity-item {
    &.item-box {
      border-bottom: 0.8rem solid #f1f1f1;
    }
    img {
      width: 43%;
    }
  }
  .news-item {
    img {
      width: 36%;
    }
  }
  .three-layout {
    img {
      width: 33%;
    }
  }
}
</style>