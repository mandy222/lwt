<template>
  <div class="home">
    <div
      class="d-flex w-100 bg-primary px-3 pt-3 text-grey-1 fs-lg lh-xxl ai-center"
    >
      <van-icon
        name="location-o"
        class="fs-xl"
      />
      {{ adress }}
      <div class="triangle_border_down-grey-1 ml-1"></div>
    </div>
    <van-sticky>
      <van-search
        placeholder="请输入搜索关键词"
        background="#FFD611"
        @focus="handleSearchFocus"
      />
    </van-sticky>

    <van-swipe
      class="my-swipe"
      :autoplay="3000"
      indicator-color="#FFD611"
    >
      <van-swipe-item
        v-for="(item, index) in ads"
        :key="index"
      >
        <img
          class="w-100"
          :src="item.image"
          @click="handleSkip(item.url)"
        >
      </van-swipe-item>
    </van-swipe>

    <m-panel
      icon="shu"
      title="推荐活动"
      to="/activity"
    >
      <div class="d-flex jc-between flex-wrap fs-md pt-3">
        <div
          class="item"
          v-for="(item, index) in activities"
          :key="index"
          :class="{ 'pr-1':index%2===0, 'pl-1':index%2!==0 }"
          @click="$router.push({ path: `/activities/${item._id}`, query: { type: 'home' }})"
        >
          <img
            class="w-100"
            :src="item.cover"
            alt=""
          >
          <p class="px-2 ellipsis-2">{{ item.name }}</p>
          <p class="d-flex jc-between flex-wrap px-2 text-grey-1 fs-sm">
            <span class="d-flex ai-center"><van-icon name="location-o" class="fs-md mr-1" />{{ item.address }}</span>
            <span>{{ handleTime(item.time) }}</span>
          </p>
        </div>
        <router-link
          tag="div"
          to="/activity"
          class="border-top w-100 py-2 d-flex jc-center text-grey-1 fs-sm"
        >
          点击查看更多
        </router-link>
      </div>
    </m-panel>

    <m-panel
      icon="shu"
      title="推荐资讯"
      to="/news"
    >
    <van-tabs
      color="#EAA61C"
      @click="handleShowNews"
      sticky
      line-width="2.1538rem"
    >
      <van-tab
        v-for="(item, index) in newsCategorities"
        :key="index"
        :title="item.name"
        class="mt-0 bg-white"
      >
      </van-tab>
    </van-tabs>

      <ul class="mt-3">
        <li
          v-for="(item, index) in newsList"
          :key="index"
          class="d-flex w-100 jc-between newsItem"
          :class="{'border-top mt-3  pt-3': index!==0}"
          @click="$router.push(`/news/${item._id}`)"
        >
            <img
              class="mr-3"
              :src="item.cover[0]"
              alt=""
            >
            <div class="flex-1 overflow-hidden lh-xxl pr-2 d-flex flex-column jc-between">
              <span class="w-100 fs-xl text-dark-1 ellipsis-2 pr-1 mb-1">
                {{ item.title }}
              </span>
              <span>
                <span class="fs-sm pr-2 text-grey-1">{{ item.publisher }}</span>
                <span class="fs-sm text-grey-1">{{ handleTime(item.updatedAt, false) }}</span>
              </span>
              
            </div>
        </li>
      </ul>

      <router-link
        tag="div"
        to="/news"
        class="border-top w-100 py-2 my-3 d-flex jc-center text-grey-1 fs-sm"
      >
        点击查看更多
      </router-link>
    </m-panel>

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
import { getToken } from '../utils/auth'
import { handleTime } from "../utils";
export default {
  data() {
    return {
      ads: [],
      showGoTop: false,
      adress: '清远',
      activities: [],
      newsCategorities: [],
      newsList: [],
      token: ''
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
    this.handleTime()
  },
  methods: {
    handleTime,
    async init() {
      this.token = getToken()
      const { data } = await this.$http.get('/rest/ads/list')
      this.ads = data[0].items

      const activities = await this.$http.get(`/rest/activities/list`, {
        params: {
          pageSize: 6
        }
      })
      this.activities = activities.data

      const newsCategorities = await this.$http.get(`/rest/categories/list`, {
        params: {
          parent: '资讯分类'
        }
      })
      this.newsCategorities = newsCategorities.data

      const newsList = await this.$http.get(`/rest/news/list`, {
        params: {
          categories: this.newsCategorities[0]._id,
          pageSize: 6
        }
      })
      this.newsList = newsList.data
    },
    handleSkip(url) {
      window.location.href = url
    },
    handleSearchFocus() {
      if (this.token) {
        this.$router.push('/search')
      } else {
        this.$router.push({path: '/register', query: {url: '/search'}})
      }
      
    },
    async handleShowNews(index, name) {
      let categories
      for (let i = 0; i < this.newsCategorities.length; i++) {
        if (this.newsCategorities[i].name === name) {
          categories = this.newsCategorities[i]._id
          break
        }
      }
      const newsList = await this.$http.get(`/rest/news/list`, {
        params: {
          categories,
          pageSize: 6
        }
      })
      this.newsList = newsList.data
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
.home {
  .my-swipe .van-swipe-item {
    color: #fff;
    text-align: center;
  }
  .item {
    width: 50%;
  }
  .newsItem img {
    width: 33%;
  }
  ::v-deep .van-tab--active {
    color: #eaa61c;
  }
  ::v-deep .van-tabs__wrap--scrollable {
    padding-bottom: 0.5rem;
  }
  ::v-deep .van-button--default {
    border: 1px solid #eaa61c;
  }
  ::v-deep .van-sticky {
    border-bottom: 1px solid #d4d9de;
  }
}
</style>
