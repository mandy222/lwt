<template>
  <div class="main">
    <van-tabbar
      route
      fixed
      active-color="#EAA61C"
      inactive-color="#666"
      v-model="active"
    >
      <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="bullhorn-o" to="/activity">活动</van-tabbar-item>
      <van-tabbar-item icon="newspaper-o" to="/news">资讯</van-tabbar-item>
      <van-tabbar-item icon="comment-circle-o" to="/trends">童圈</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/my">我的</van-tabbar-item>
       
    </van-tabbar>

    <!-- <router-view></router-view> -->
    <!-- <keep-alive include="Activity, Home"> -->
        <router-view></router-view>
    
    <div class="emtry-box"></div>
  </div>
</template>

<script>
// import Activity from '../views/Activity'
export default {
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  ::v-deep .van-tabbar-item__icon {
    font-size: 1.7692rem;
  }
  .emtry-box {
    height: 3rem;
  }
}
</style>
