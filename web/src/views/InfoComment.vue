<template>
  <div class="comment">
    <van-nav-bar
      title="评论"
      left-arrow
      @click-left="$router.back(-1)"
      class="border-bottom"
    />
    
    <div v-if="list.length>0" class="bg-white">
      <div class="d-flex w-100 jc-between p-3 ml-1 text-grey-1">
        <span class="d-flex flex-1">未读消息：{{ noRead }} </span>
        <span class="text-light" @click="handleDelAll">清空所有消息</span>
      </div>
      <ul>
        <li class="d-flex jc-between px-3 mx-1 py-3 ai-center fs-lg text-grey-1 border w-100 flex-wrap" v-for="(item, index) in list" :key="index">
          <van-tag plain color="#EAA61C" size="medium" class="mr-3">动态</van-tag>
          <div v-show="item.read===false" class="m-dot"></div>
          <span class="text-blue" @click="$router.push(`/myTrends/${item.sender._id}`)"><strong>{{ item.sender && item.sender.username }}</strong></span>
          <span class="d-flex ml-2">评论了你的动态</span>
          <div class="d-flex flex-1 jc-end">
            <span class="d-flex pr-3">{{ handleTime(item.createdAt, false, true) }}</span>
            <van-icon name="delete" @click="handleDel(item._id, index)" />
          </div>

          <div class="w-100 my-3" @click="$router.push(`/trends/${item.content}`)">
            <strong>{{ item.comment }}</strong>
          </div>
          
        </li>
      </ul>
    </div>
    <van-empty class="bg-white" v-else description="暂无评论消息~" />
  </div>
</template>

<script>
import { handleTime } from "../utils"
import { mapGetters } from 'vuex'
import { Toast, Dialog } from 'vant'
export default {
  props: {
    id: { required: true }
  },
  data() {
    return {
      list: [],
      noRead: 0,
      category: ''
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters({
      'userId': 'id'
    })
  },
  methods: {
    handleTime,
    async init() {
      const { data } = await this.$http.get(`/info/comments/${this.id}`)
      this.list = data.reverse()
      if(this.list.length!=0) {
        this.category = this.list[0].category
      }
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].read === false) {
          this.noRead++
        }
      }
      console.log('data', data)
    },
    async handleDelAll() {
      Dialog.confirm({
        message: '确认清除所有评论消息吗？',
      })
        .then(async () => {
          await this.$http.delete(`/info/deleteAll/${this.id}`, {data: {category: this.category}})
          Toast.success('消息清除成功')
          this.list = []
        })
        .catch(() => {
          // on cancel
        })
    },
    async handleDel(id, index) {
      Dialog.confirm({
        message: '确认删除该消息吗吗？',
      })
        .then(async () => {
          await this.$http.delete(`/rest/informations/delete/${id}`)
          Toast.success('消息删除成功')
          this.list.splice(index, 1)
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.comment {
  ::v-deep {
    .van-cell__left-icon {
      font-size: 1.5rem;
    }
    .van-cell:not(:last-child)::after {
      left: 0;
    }
    .van-cell {
      display: flex;
      align-items: center;
    }
    .van-nav-bar__title {
      font-weight: 550;
    }
    .van-icon-arrow-left,
    .van-nav-bar__text {
      color: #eaa61c;
    }
  }
  .border {
    position: relative;
  }
  .border::after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .m-dot {
    position: relative;
  }
  .m-dot:after {
    position: absolute;
    content: '';
    top: -0.9231rem;
    left: -1.1538rem;
    width: 0.4615rem;
    height: 0.4615rem;
    background:red;
    border-radius: 50%;
  }
}
</style>