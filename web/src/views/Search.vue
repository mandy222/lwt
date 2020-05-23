<template>
  <div class="search bg-white">
    <van-nav-bar
      title=""
      left-arrow
      @click-left="$router.push('/')"
    />

    <van-sticky>
      <van-search
        v-model.trim="message"
        placeholder="请输入搜索关键词"
        background="white"
        show-action
        @blur="handleSearchFocus"
        @clear="handleClear"
        @cancel="handleClear"
      />
    </van-sticky>

    <div v-if="show">
      <div
        v-if="historyKeys.length>0"
        class="bg-white mb-3"
      >
        <div class="d-flex jc-between p-3">
          <span class="fs-lg"><strong>历史搜索</strong></span>
          <span>
            <van-icon
              class="fs-lg"
              name="delete"
              @click="handleDel"
            /></span>
        </div>
        <ul class="d-flex flex-wrap mx-3 my-1">
          <li
            class="text bg-light-2 p-2 mr-3 mb-3"
            v-for="(item, index) in historyKeys"
            :key="index"
            @click="handleSelect(item)"
          >{{ item }}</li>
        </ul>
      </div>

      <div class="bg-white">
        <div class="d-flex jc-between p-3">
          <span class="fs-lg"><strong>热门搜索</strong></span>
        </div>
        <ul class="d-flex flex-wrap mx-3 my-1">
          <li
            class="text bg-light-2 p-2 mr-3 mb-3"
            v-for="(item, index) in hotKeys"
            :key="index"
            @click="handleSelect(item)"
          >{{ item }}</li>
        </ul>
      </div>
    </div>

    <div v-if="list.length>0">
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
      <div
        v-for="(item, i) in list"
        :key="i"
        :class="{'activity-item': item.name}"
        @click="$router.push({ path: item.name ? `/activities/${item._id}` : `/news/${item._id}`, query: { message: `${message}` }})"
      >
        <!-- 活动 -->
        <div
          v-if="item.name"
          class="mx-3 mt-3 border-bottom"
        >
          <div class="d-flex w-100 jc-between pb-2 border-bottom">
            <img
              class="mr-3"
              :src="item.cover"
              alt=""
            >
            <div class="flex-1 overflow-hidden lh-xxl pr-2 ai-stretch d-flex flex-column">
              <span class="w-100 fs-xl text-dark-1 ellipsis-2 pr-1 mb-1">
                {{ item.name }}
              </span>
              <div class="flex-1 w-100"></div>
              <span class="fs-sm pr-2 text-grey-1">{{ item.leader }}</span>
              <span class="fs-sm pr-2 text-grey-1">{{ handleTime(item.time, false, false) }}</span>
            </div>
          </div>
          <div class="d-flex w-100 jc-between ai-center">
            <span class="text-light my-2">
              <span
                class="mr-2"
                v-for="(keyWord, j) in item.keyWords"
                :key="j"
              >{{ `#${keyWord}` }}</span>
            </span>
            <van-button
              round
              class="btn text-light my-2"
              size="small"
            >{{ item.status===true ? (item.participants.indexOf(userId)!==-1 ? '已报名': '立即报名') : `活动已结束`}}</van-button>
          </div>
        </div>

        <div v-if="item.title">
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
        </div>
      </div>
      <div class="w-100 p-2 d-flex jc-center text-grey-1 fs-sm bg-white" @click="handleLookMore">
        {{ lookMore===true ? '点击查看更多' : '已经到底了~' }}
      </div>
    </div>

    

    <van-empty
      v-if="list.length===0 && !show"
      image="search"
      description="没有搜索结果，换个关键词试试吧~"
    />

  </div>
</template>

<script>
import { handleTime } from '../utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [],
      message: '',
      hotKeys: [
        '手工', '五月', 'DIY', '新冠', '前公牛GM', '爬山', '教育', '电商', '公益演出'
      ],
      historyKeys: [],
      pageSize: 10,
      currentPage: 1,
      show: true,
      lookMore: true,
      showGoTop: false
    }
  },
  created() {
    this.message = this.$route.query.message
    this.init()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    ...mapGetters({
      'userId': 'id'
    })
  },
  methods: {
    handleTime,
    async init() {
      this.historyKeys = localStorage.getItem('serchKey') && localStorage.getItem('serchKey').split(',') || []
      this.handleSearchFocus()
    },
    async handleSearchFocus(lookMore=false) {
      if (this.message) {
        let index = this.historyKeys.indexOf(this.message)
        if (index === -1) {
          this.historyKeys.unshift(this.message)
        } else {
          this.historyKeys.splice(index, 1)
          this.historyKeys.unshift(this.message)
        }

        localStorage.setItem('serchKey', this.historyKeys)
        const { data } = await this.$http.get(`/search`,
          {
            params: {
              searchKey: this.message,
              pageSize: 10,
              currentPage: this.currentPage
            }          }
        )
        console.log('data', data)
        if (lookMore) {
          this.list = this.list.concat(data.item)
        } else {
          this.lookMore = true
          this.list = data.item
        }
        this.show = false
        this.total = data.total
        console.log('this.total', this.total)
        if (this.total <= (this.currentPage)*10) {
          this.lookMore = false
        }
      }
    },
    handleDel() {
      localStorage.removeItem('serchKey')
      this.historyKeys = []
    },
    handleSelect(item) {
      this.message = item
      this.currentPage = 1
      this.handleSearchFocus()
    },
    handleClear() {
      this.show = true
      this.list = []
    },
    async handleLookMore() {
      this.currentPage++
      this.handleSearchFocus(true)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  min-height: 100vh;
  ::v-deep {
    .van-icon-arrow-left {
      color: #eaa61c;
    }
    .van-nav-bar__title {
      font-weight: 550;
    }
  }
  .activity-item {
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