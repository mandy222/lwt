<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎使用“老顽童”后台管理系统</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    display: flex;
    justify-content: center;
    margin: 30vh;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
