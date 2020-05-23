<template>
  <div class="info">
    <van-nav-bar
      title="个人设置"
      left-arrow
      @click-left="$router.back(-1)"
      class="border-bottom"
    />
    
    <ul class="bg-white">
      <li class="d-flex jc-between px-3 mx-1 py-3 ai-center fs-lg text-grey-1 border">
        <strong>头像</strong>

        <div class="d-flex flex-1 jc-end mr-2">
          <van-uploader
            v-model="fileList"
            :after-read="handleRead"
            :preview-image="false"
          >
            <img
              class="avatar"
              v-if="avatar!=='undefined'"
              :src="avatar"
              alt=""
            >
            <img
              class="avatar"
              v-else
              src="../assets/image/avatar-boy.jpg"
              alt=""
            >
          </van-uploader>
        </div>
        <van-icon name="arrow" />
      </li>
      <li class="d-flex jc-between px-3 mx-1 py-3 ai-center fs-lg text-grey-1 border">
        <strong>用户名</strong>
        <span class="d-flex flex-1 jc-end mx-2">{{ name }}</span>
      </li>
    </ul>

    <div class="d-flex jc-between px-3 py-3 ai-center fs-lg text-grey-1 mt-4 bg-white">
      <span>登录密码</span>
      <span class="d-flex flex-1 mx-2 jc-end text-light" @click="$router.push('/update/password')">修改</span>
      <van-icon name="arrow" @click="$router.push('/update/password')" />
    </div>

    <div class="d-flex jc-center px-3 py-3 ai-center fs-lg mt-4 bg-white" @click="hanleLogout">
      <strong class="text-red">退出登录</strong>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      fileList: []
    }
  },
  computed: {
    ...mapGetters({
      'userId': 'id',
      'avatar': 'avatar',
      'name': 'name'
    })
  },
  methods: {
    async handleRead(file) {
        let content = file.file;
        let params = new FormData()
        params.append('file',content)
        const { data } = await this.$http.post(`/upload`, params)
        this.fileList.splice(this.fileList.length-1, 1, data.url)
        await this.$http.put(`/rest/users/update/${this.userId}`, {avatar: this.fileList[0]})
        await this.$store.dispatch('user/getInfo')
    },
    async hanleLogout() {
      await this.$store.dispatch('user/logout')
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
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
  .border::before {
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
  .avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 4rem;
    border: 1px solid #d4d9de;
  }
}
</style>