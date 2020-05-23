<template>
  <div class="news">
    <van-sticky>
      <div class="d-flex ai-center jc-between bg-white">
        <div class="flex-1 news-tabs">
          <van-tabs
            v-if="showTab"
            v-model="activeName"
            color="#EAA61C"
            @click="handleShow"
            sticky
            line-width="2rem"
          >
            <van-tab
              v-for="(item, index) in titleList"
              :key="index"
              :title="item.name"
              :name="item.name"
            >
            </van-tab>
          </van-tabs>
        </div>
        <span class="px-4"></span>
        <router-link
          tag="span"
          :to='`/category/${categories}`'
        >
          <van-icon
            class="down-btn"
            name="arrow-down"
          />
        </router-link>
      </div>
    </van-sticky>

    <ul class="bg-white">
      <li
        v-for="(item, index) in list"
        :key="index"
        @click="$router.push({ path: `/news/${item._id}`, query: { type: `${activeName}` }})"
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
    <div class="w-100 py-2 mb-4 mt-2 d-flex jc-center text-grey-1 fs-sm bg-white" @click="handleLookMore">
      {{ lookMore===true ? '点击查看更多' : '已经到底了~' }}
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
export default {
  data() {
    return {
      titleList: [],
      list: [],
      currentPage: 1,
      categories: '',
      activeName: '',
      showTab: false,
      lookMore: true,
      total: 0,
      showGoTop: false
    }
  },
  created() {
    this.init()
    this.activeName = this.$route.query.type
    setTimeout(() => {
      this.showTab = true
    }, 50)
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleTime,
    async init() {
      const titleList = await this.$http.get(`/rest/categories/list`, {
        params: {
          parent: '资讯分类'
        }
      })
      this.titleList = titleList.data

      let categories
      for (let i = 0; i < this.titleList.length; i++) {
        if (this.titleList[i].name === this.activeName) {
          categories = this.titleList[i]._id
          break
        }
      }
      this.categories = categories || this.titleList[0]._id

      const { data } = await this.$http.get(`/rest/news/page/list`, {
        params: {
          categories: this.categories,
          pageSize: 10,
          currentPage: this.currentPage
        }
      })
      this.list = this.list.concat(data.list)
      this.total = data.total
    },
    async handleShow(index, name) {
      this.activeName = name
      this.currentPage = 1
      let categories
      console.log('this.titleList', this.titleList.length)
      for (let i = 0; i < this.titleList.length; i++) {
        if (this.titleList[i].name === name) {
          categories = this.titleList[i]._id
          break
        }
      }
      this.categories = categories
      const { data } = await this.$http.get(`/rest/news/page/list`, {
        params: {
          categories: this.categories,
          pageSize: 10,
          currentPage: this.currentPage
        }
      })
      this.list = data.list
      this.total = data.total
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },
    async handleLookMore() {
      this.currentPage++
      if (this.total <= (this.currentPage-1)*10) {
        this.lookMore = false
      } else {
        const { data } = await this.$http.get(`/rest/news/page/list`, {
          params: {
            categories: this.categories,
            pageSize: 10,
            currentPage: this.currentPage
          }
        })
        this.list = this.list.concat(data.list)
        if (data.total===this.list.length) {
          this.lookMore = false
        }
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
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }
}
</script>

<style lang="scss" scoped>
.news {
  ::v-deep .van-tab--active {
    color: #eaa61c;
  }
  ::v-deep .van-tabs__wrap--scrollable {
    padding-bottom: 0.7rem;
    border-bottom: 1px solid #d4d9de;
  }
  .news-tabs {
    overflow: hidden;
  }
  .down-btn {
    padding: 1.15rem;
    position: fixed;
    top: 0%;
    right: 0;
    z-index: 99;
    border-bottom: 1px solid #d4d9de;
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