<template>
  <div class="news-category">
    <van-nav-bar
      title="资讯分类"
      left-arrow
      @click-left="onClickLeft"
    />
    <ul class="d-flex jc-between flex-wrap">
      <li v-for="(item, index) in list" :key="index" class="item mt-3">
        <span class="bg-white px-5 py-2 btn" :class="{'active': item._id===type}" @click="handleChooseCategory(item)">
          {{ item.name }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    type: { required: true }
  },
  watch: {
    type: 'init'
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const list = await this.$http.get(`/rest/categories/list`, {
        params: {
          parent: '资讯分类'
        }
      })
      this.list = list.data
    },
    onClickLeft() {
      this.$router.back(-1)
    },
    handleChooseCategory(item) {
      this.$router.push({ path: '/news', query: { type: item.name }})
    }
  }
}
</script>

<style lang="scss" scoped>
.news-category {
  ::v-deep {
    .van-icon-arrow-left {
      color: #eaa61c;
    }
    .van-nav-bar__title {
      font-weight: 550;
    }
  }
  .item {
    flex-basis: 33.3%;
    text-align: center;
    .btn {
      display: inline-block;
      border: 1px solid #d4d9de;
      border-radius: 0.4615rem;
    }
    .active {
      border-color: #EAA61C;
    }
  }
}
</style>