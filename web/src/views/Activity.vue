<template>
  <div class="activity">
    <van-tabs
      v-if="showTab"
      color="#EAA61C"
      sticky
      line-width="2.3077rem"
      @click="handleShow"
      v-model="activeName"
    >
      <van-tab
        v-for="(item, index) in titleList"
        :key="index"
        :title="item.name"
        :name="item.name"
        class="mt-0 bg-white"
      >
        <!-- 内容 {{ index }} -->
        <div
          v-for="(activitis, i) in list"
          :key="i"
          class="activity-item px-3"
          :class="{'item-box': i!==list.length}"
          @click="$router.push({ path: `/activities/${activitis._id}`, query: { type: `${activeName}` }})"
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
              <span class="mr-2" v-for="(keyWord, j) in activitis.keyWords" :key="j">{{ `#${keyWord}` }}</span>
            </span>
            <van-button
              round
              class="btn text-light my-2"
              size="small"
            >{{ activitis.status===true ? (activitis.participants.indexOf(userId)!==-1 ? '已报名': '立即报名') : `活动已结束`}}</van-button>
          </div>
        </div>
      </van-tab>
      <div class="w-100 py-2 mb-4 mt-2 d-flex jc-center text-grey-1 fs-sm bg-white" @click="handleLookMore">
        {{ lookMore===true ? '点击查看更多' : '已经到底了~' }}
      </div>
    </van-tabs>
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
import { handleTime} from '../utils'
import { mapGetters } from 'vuex'
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
      showGoTop: false,
      activityText: '立即报名'
    }
  },
  computed: {
    ...mapGetters({
      'userId': 'id'
    })
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
          parent: '活动分类'
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

      const { data } = await this.$http.get(`/rest/activities/page/list`, {
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
      this.lookMore = true
      let categories
      for (let i = 0; i < this.titleList.length; i++) {
        if (this.titleList[i].name === name) {
          categories = this.titleList[i]._id
          break
        }
      }
      this.categories = categories
      const { data } = await this.$http.get(`/rest/activities/page/list`, {
        params: {
          categories: this.categories,
          pageSize: 10,
          currentPage: this.currentPage
        }
      })
      this.list = data.list
      this.total = data.total
      if (data.total<=this.currentPage * this.pageSize) {
          this.lookMore = false
        }
    },
    async handleLookMore() {
      this.currentPage++
      if (this.total <= (this.currentPage-1)*10) {
        this.lookMore = false
      } else {
        const { data } = await this.$http.get(`/rest/activities/page/list`, {
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
.activity {
  ::v-deep .van-tab--active {
    color: #eaa61c;
  }
  ::v-deep .van-tabs__wrap--scrollable {
    padding-bottom: 0.7rem;
  }
  ::v-deep .van-button--default {
    border: 1px solid #eaa61c;
  }
  .activity-item {
    &.item-box {
      border-bottom: 0.8rem solid #f1f1f1;
    }
    img {
      width: 43%;
    }
  }
  ::v-deep .van-sticky {
    border-bottom: 1px solid #d4d9de;
  }
}
</style>