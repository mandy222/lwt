<template>
  <div class="activity-detail bg-white">
    <van-nav-bar
      title="动态评论"
      left-arrow
      right-text="发布"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="border-bottom"
    />
    <div class="d-flex bg-white flex-column">
      <van-field
        class="pt-2"
        v-model.trim="message"
        autosize
        type="textarea"
        placeholder="请输入评论..."
        :border="false"
      />
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
  props: {
    id: { required: true }
  },
  components: {
    VEmojiPicker
  },
  data() {
    return {
      likesIcon: 'star-o',
      message:'',
      emjoy: false,
      operation: [],
      recipient: ''
    }
  },
  computed: {
    ...mapGetters({
      'userId': 'id'
    })
  },
  created() {
    this.comments = this.$route.query.comments
    this.recipient = this.$route.query.recipient
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    async onClickRight() {     
      // console.log('this.id, this.operation', this.id, this.operation, this.recipient)
      let comments = Array.from(this.comments)
      comments.push(
        {
          user: this.userId,
          content: this.message,
          commentsTime: new Date()
        }
      )
      await this.$http.put(`/rest/trends/update/${this.id}`,
      { comments: comments, detail: this.message, sender: this.userId, recipient: this.recipient })
      Toast.success('评论发布成功')
      this.$router.back(-1)
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