<template>
  <div class="activity-detail bg-white">
    <van-nav-bar
      title="动态"
      left-arrow
      right-text="发布"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="border-bottom"
    />
    <div class="d-flex bg-white flex-column">
      <van-field
        class="pt-2"
        v-model="message"
        autosize
        type="textarea"
        placeholder="分享动态..."
        :border="false"
      />
      <div class="mx-3">
        <div class="">
          <van-uploader
            class="d-flex imgbox jc-between"
            v-model="fileList"
            multiple
            :max-count="9"
            upload-icon="plus"
            :after-read="handleRead"
          >
          </van-uploader>
        </div>
      </div>
    </div>
    
    <div class="d-flex jc-start ai-center bg-white bottom-nav text-grey-1 flex-wrap">
      <p class="w-100 fs-bl mx-4 my-0 p-0">
        <van-icon v-show="emjoy===false" name="smile-o" @click="emjoy=!emjoy"/>
        <span v-show="emjoy===true" class="icon iconfont icon-jianpan fs-bl"  @click="emjoy=!emjoy"></span>
      </p>
      <transition enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
        <VEmojiPicker :showSearch="false" @select="selectEmoji" class="w-100" v-show="emjoy===true" />       
      </transition>
    </div>
  </div>
</template>

<script>
import VEmojiPicker from 'v-emoji-picker'
import { mapGetters } from 'vuex'
import { Toast } from 'vant'
export default {
  components: {
    VEmojiPicker
  },
  data() {
    return {
      likesIcon: 'star-o',
      message:'',
      fileList: [],
      emjoy: false
    }
  },
  computed: {
    ...mapGetters({
      'userId': 'id'
    })
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    async onClickRight() {      
      let images = []
      for (let index = 0; index < this.fileList.length; index++) {
        images.push({url: this.fileList[index].url})
      }
      const content = {
        text:this.message,
        images: images
      }
      await this.$http.post(`/rest/trends/create`, {content: content, user: this.userId})
      Toast.success('动态发布成功')
      this.$router.back(-1)
      
    },
    async handleRead(file) {
        let content = file.file;
        let params = new FormData()
        params.append('file',content)
        const { data } = await this.$http.post(`/upload`, params)
        this.fileList.splice(this.fileList.length-1, 1, {url: data.url, isImage: true})
    },
    selectEmoji(emoji) {
      console.log(emoji)
      this.message = this.message + emoji.data
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-detail {
  min-height: 100vh;
  ::v-deep {
    .van-nav-bar__title {
      font-weight: 550;
    }
    .van-icon-arrow-left, .van-nav-bar__text {
      color: #eaa61c;
    }
    .van-nav-bar__text {
      font-size: 1.1538rem;
    }
    .van-field__control {
      padding-top: 10px;
    }
    textarea {
      min-height: 10vh;
    }
    .van-uploader__upload, .van-uploader__preview-image {
      width: 27.89vw;
      height: 30vw;
      position: relative;
      left: 0.7692rem;
    }
    #Emojis .container-emoji {
      height: 15.3077rem!important;
    }
  }
  .bottom-nav {
    position: fixed;
    bottom: 0;
  }
  #EmojiPicker {
    width: 100vw!important;
  }
  
}
</style>